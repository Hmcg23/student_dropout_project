"""Reproduce the notebook pipeline (iX_DS_Project_clean.ipynb) and export
every number the blog charts need to src/app/data/chartData.json.

RFECV feature selection and both grid searches are not re-run; their results
(selected feature list, tuned hyperparameters) are taken from the committed
notebook outputs.
"""

import json
from pathlib import Path

import numpy as np
import pandas as pd
from imblearn.over_sampling import SMOTE
from sklearn.cluster import KMeans
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    auc,
    confusion_matrix,
    f1_score,
    recall_score,
    roc_curve,
)
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler, label_binarize
from sklearn.svm import SVC
from xgboost import XGBClassifier

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parents[1] / "src" / "app" / "data" / "chartData.json"

# From RFECV output in the clean notebook (cell 25): 43 features
SELECTED_FEATURES = ['Course', 'Daytime/evening attendance\t', 'Previous qualification (grade)', "Father's qualification", "Mother's occupation", "Father's occupation", 'Admission grade', 'Displaced', 'Educational special needs', 'Debtor', 'Tuition fees up to date', 'Gender', 'Scholarship holder', 'Age at enrollment', 'Curricular units 1st sem (credited)', 'Curricular units 1st sem (enrolled)', 'Curricular units 1st sem (evaluations)', 'Curricular units 1st sem (approved)', 'Curricular units 1st sem (grade)', 'Curricular units 1st sem (without evaluations)', 'Curricular units 2nd sem (enrolled)', 'Curricular units 2nd sem (evaluations)', 'Curricular units 2nd sem (approved)', 'Curricular units 2nd sem (grade)', 'Curricular units 2nd sem (without evaluations)', 'Unemployment rate', 'Inflation rate', 'GDP', 'approval_rate_1st_sem', 'failed_courses_1st_sem', 'avg_first_sem_grade', 'financial_risk', 'approved_units_diff', 'overall_approval_rate', 'overall_grade_avg', 'second_sem_pass_rate', 'failures_2nd_sem', 'missed_eval_ratio_1st', 'financial_risk_score', 'parent_education_avg', 'academic_risk', 'grade_consistency', 'Cluster']

# From grid-search outputs (cells 37 / 40)
BEST_PARAMS_RF = {"max_depth": 20, "min_samples_leaf": 2, "min_samples_split": 10, "n_estimators": 200, "random_state": 42}
BEST_PARAMS_XGB = {"colsample_bytree": 0.6, "learning_rate": 0.1, "max_depth": 3, "n_estimators": 100, "random_state": 42, "subsample": 1.0}

CLASS_NAMES = ["Dropout", "Enrolled", "Graduate"]


def build_features() -> pd.DataFrame:
    df = pd.read_csv(ROOT / "dropout_data.csv", sep=";")

    df["Is_Dropout"] = (df["Target"] == "Dropout").astype(int)
    numerical_cols = df.select_dtypes(include="number").columns.tolist()
    corr = df[numerical_cols].corr()["Is_Dropout"].drop("Is_Dropout")

    class_counts = df["Target"].value_counts().to_dict()

    df["approval_rate_1st_sem"] = (
        df["Curricular units 1st sem (approved)"] / df["Curricular units 1st sem (enrolled)"]
    ).fillna(0)
    df["failed_courses_1st_sem"] = (
        df["Curricular units 1st sem (enrolled)"] - df["Curricular units 1st sem (approved)"]
    )
    df["avg_first_sem_grade"] = (
        df["Curricular units 1st sem (grade)"] / df["Curricular units 1st sem (approved)"]
    ).fillna(0)
    df["financial_risk"] = ((df["Debtor"] == 1) | (df["Tuition fees up to date"] == 0)).astype(int)

    df_prepared = df.drop(columns=["Application mode", "Nacionality", "Application order", "Is_Dropout"])
    df_prepared["Target"] = df_prepared["Target"].map({"Dropout": 0, "Enrolled": 1, "Graduate": 2})

    df_prepared["approved_units_diff"] = (
        df_prepared["Curricular units 2nd sem (approved)"] - df_prepared["Curricular units 1st sem (approved)"]
    )
    total_enrolled = df_prepared["Curricular units 1st sem (enrolled)"] + df_prepared["Curricular units 2nd sem (enrolled)"]
    total_approved = df_prepared["Curricular units 1st sem (approved)"] + df_prepared["Curricular units 2nd sem (approved)"]
    df_prepared["overall_approval_rate"] = (total_approved / total_enrolled).fillna(0)
    sum_grades_1st = df_prepared["avg_first_sem_grade"] * df_prepared["Curricular units 1st sem (approved)"]
    sum_grades_2nd = df_prepared["Curricular units 2nd sem (grade)"] * df_prepared["Curricular units 2nd sem (approved)"]
    df_prepared["overall_grade_avg"] = ((sum_grades_1st + sum_grades_2nd) / total_approved).fillna(0)
    df_prepared["second_sem_pass_rate"] = (
        df_prepared["Curricular units 2nd sem (approved)"] / df_prepared["Curricular units 2nd sem (enrolled)"]
    ).fillna(0)
    df_prepared["grade_improvement"] = (
        df_prepared["Curricular units 2nd sem (grade)"] - df_prepared["Curricular units 1st sem (grade)"]
    ).fillna(0)
    df_prepared["failures_2nd_sem"] = (
        df_prepared["Curricular units 2nd sem (enrolled)"] - df_prepared["Curricular units 2nd sem (approved)"]
    )
    df_prepared["missed_eval_ratio_1st"] = (
        df_prepared["Curricular units 1st sem (without evaluations)"] / df_prepared["Curricular units 1st sem (enrolled)"]
    ).fillna(0)
    df_prepared["missed_eval_ratio_2nd"] = (
        df_prepared["Curricular units 2nd sem (without evaluations)"] / df_prepared["Curricular units 2nd sem (enrolled)"]
    ).fillna(0)
    df_prepared["financial_risk_score"] = df_prepared["Debtor"] + (1 - df_prepared["Tuition fees up to date"])
    df_prepared["parent_education_avg"] = (
        (df_prepared["Mother's qualification"] + df_prepared["Father's qualification"]) / 2
    ).fillna(0)
    df_prepared["academic_risk"] = df_prepared["failed_courses_1st_sem"] * (1 - df_prepared["approval_rate_1st_sem"])
    df_prepared["financial_academic_risk"] = df_prepared["financial_risk_score"] * df_prepared["failed_courses_1st_sem"]
    df_prepared["grade_consistency"] = (
        df_prepared["Curricular units 2nd sem (grade)"] - df_prepared["Curricular units 1st sem (grade)"]
    ).abs()

    X = df_prepared.drop(columns=["Target"])
    scaler = StandardScaler()
    df_scaled = pd.DataFrame(scaler.fit_transform(X), columns=X.columns)
    kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
    df_prepared["Cluster"] = kmeans.fit_predict(df_scaled)

    return df_prepared, corr, class_counts


def downsample_curve(fpr, tpr, n=60):
    if len(fpr) <= n:
        idx = np.arange(len(fpr))
    else:
        idx = np.unique(np.linspace(0, len(fpr) - 1, n).astype(int))
    return [{"fpr": round(float(fpr[i]), 4), "tpr": round(float(tpr[i]), 4)} for i in idx]


def main():
    df_prepared, corr, class_counts = build_features()

    X = df_prepared.drop(columns=["Target"])[SELECTED_FEATURES]
    y = df_prepared["Target"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # --- 7-model comparison (defaults, as in the original notebook) ---
    models = {
        "Logistic Regression": LogisticRegression(max_iter=5000, solver="lbfgs", random_state=42),
        "Random Forest": RandomForestClassifier(random_state=42),
        "XGBoost": XGBClassifier(objective="multi:softmax", num_class=3, eval_metric="mlogloss", random_state=42),
        "Neural Network (MLP)": MLPClassifier(hidden_layer_sizes=(100, 50), max_iter=500, activation="relu", solver="adam", random_state=42, early_stopping=True, n_iter_no_change=20),
        "SVC": SVC(random_state=42, probability=True),
        "K-Nearest Neighbors": KNeighborsClassifier(n_neighbors=5),
        "Gradient Boosting": GradientBoostingClassifier(random_state=42),
    }
    model_comparison = []
    preds = {}
    for name, model in models.items():
        model.fit(X_train, y_train)
        p = model.predict(X_test)
        preds[name] = p
        model_comparison.append({
            "model": name,
            "accuracy": round(float(accuracy_score(y_test, p)), 4),
            "f1Weighted": round(float(f1_score(y_test, p, average="weighted")), 4),
        })

    rf_model = models["Random Forest"]
    xgb_model = models["XGBoost"]

    # --- Feature importances (baseline RF, as in slide 7) ---
    importances = sorted(
        zip(X_train.columns, rf_model.feature_importances_), key=lambda t: t[1], reverse=True
    )
    feature_importance = [
        {"feature": f, "importance": round(float(v), 4)} for f, v in importances[:5]
    ]

    # --- ROC curves (baseline RF + XGBoost, OvR) ---
    y_test_bin = label_binarize(y_test, classes=[0, 1, 2])
    roc = {}
    for name, model in [("Random Forest", rf_model), ("XGBoost", xgb_model)]:
        proba = model.predict_proba(X_test)
        roc[name] = []
        for i, cls in enumerate(CLASS_NAMES):
            fpr, tpr, _ = roc_curve(y_test_bin[:, i], proba[:, i])
            roc[name].append({
                "class": cls,
                "auc": round(float(auc(fpr, tpr)), 4),
                "points": downsample_curve(fpr, tpr),
            })

    # --- SMOTE variant (tuned params + balanced class weights, per notebook) ---
    smote = SMOTE(random_state=42)
    X_train_sm, y_train_sm = smote.fit_resample(X_train, y_train)
    rf_smote = RandomForestClassifier(**{**BEST_PARAMS_RF, "class_weight": "balanced"})
    rf_smote.fit(X_train_sm, y_train_sm)
    p_smote = rf_smote.predict(X_test)

    enrolled_recall_before = recall_score(y_test, preds["Random Forest"], labels=[1], average="macro")
    enrolled_recall_after = recall_score(y_test, p_smote, labels=[1], average="macro")

    cm = confusion_matrix(y_test, p_smote)

    # --- Binary reframe: Dropout vs Not-Dropout (cell 73) ---
    y_train_bin = (y_train != 0).astype(int)
    y_test_bin1 = (y_test != 0).astype(int)
    stage1 = RandomForestClassifier(**{**BEST_PARAMS_RF, "class_weight": "balanced"})
    stage1.fit(X_train, y_train_bin)
    s1_pred = stage1.predict(X_test)
    binary_accuracy = accuracy_score(y_test_bin1, s1_pred)
    dropout_recall = recall_score(y_test_bin1, s1_pred, pos_label=0)

    # --- EDA correlations: top positive + top negative with dropout ---
    corr_sorted = corr.sort_values()
    corr_out = [
        {"feature": f, "value": round(float(v), 2)}
        for f, v in pd.concat([corr_sorted.head(6), corr_sorted.tail(6)]).items()
    ]

    data = {
        "classDistribution": [
            {"class": c, "count": int(class_counts[c])} for c in CLASS_NAMES
        ],
        "modelComparison": model_comparison,
        "featureImportance": feature_importance,
        "smoteRecall": {
            "before": round(float(enrolled_recall_before), 4),
            "after": round(float(enrolled_recall_after), 4),
            "smoteAccuracy": round(float(accuracy_score(y_test, p_smote)), 4),
        },
        "confusionMatrix": {"labels": CLASS_NAMES, "matrix": cm.tolist()},
        "roc": roc,
        "correlations": corr_out,
        "binaryFlag": {
            "accuracy": round(float(binary_accuracy), 4),
            "dropoutRecall": round(float(dropout_recall), 4),
        },
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2))

    print(f"wrote {OUT}")
    print("sanity vs slides:")
    rf = next(m for m in model_comparison if m["model"] == "Random Forest")
    print(f"  RF acc {rf['accuracy']:.3f} (slide 0.774), F1w {rf['f1Weighted']:.3f} (slide 0.76)")
    print(f"  enrolled recall {enrolled_recall_before:.3f} -> {enrolled_recall_after:.3f} (slide 0.384 -> 0.503)")
    print(f"  binary flag acc {binary_accuracy:.3f} (slide 0.87), dropout recall {dropout_recall:.3f} (slide 0.76)")
    print(f"  RF AUCs {[r['auc'] for r in roc['Random Forest']]} (slide 0.91/0.82/0.93)")
    print(f"  confusion matrix {cm.tolist()} (slide [[213,35,36],[32,80,47],[15,40,387]])")
    print(f"  top5 features {[f['feature'] for f in feature_importance]}")


if __name__ == "__main__":
    main()
