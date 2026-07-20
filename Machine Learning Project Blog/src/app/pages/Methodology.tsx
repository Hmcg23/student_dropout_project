import { Link } from "react-router";
import Code from "../components/Code";
import ChartCard from "../components/charts/ChartCard";
import ClassDonut from "../components/charts/ClassDonut";
import ConfusionMatrix from "../components/charts/ConfusionMatrix";
import CorrelationBars from "../components/charts/CorrelationBars";
import FeatureImportance from "../components/charts/FeatureImportance";
import ModelComparison from "../components/charts/ModelComparison";
import RocCurves from "../components/charts/RocCurves";
import SmoteRecall from "../components/charts/SmoteRecall";

const bodyText = "font-['DM_Sans'] text-base leading-[1.85] text-foreground font-light";

function Section({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="max-w-3xl mx-auto px-6 py-12 border-b border-border">
      <h2 className="font-['Lora'] text-2xl font-semibold text-foreground mb-6">{heading}</h2>
      {children}
    </section>
  );
}

export default function Methodology() {
  return (
    <main>
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 border-b border-border">
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/"
            className="font-['DM_Mono'] text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Overview
          </Link>
        </div>
        <h1 className="font-['Lora'] text-4xl font-semibold leading-[1.15] tracking-tight text-foreground mb-6">
          Methodology
        </h1>
        <p className="font-['DM_Sans'] text-lg text-muted-foreground leading-relaxed font-light">
          A more in depth description of our work: exploratory analysis, feature engineering, model selection,
          class-imbalance handling, and evaluation. Every chart on this page comes straight
          from the pipeline&rsquo;s own output on the UCI dataset.
        </p>
      </section>

      <Section id="dataset" heading="Dataset & Exploratory Analysis">
        <p className={bodyText}>
          The UCI &ldquo;Predict Students&rsquo; Dropout and Academic Success&rdquo; dataset
          (Dataset 697) covers 4,424 students, each with 36 attributes recorded at enrollment
          and across the first academic year: curricular performance per semester,
          demographics, and socioeconomic indicators. There are no missing values and no
          free-text categorical columns to clean up. The target splits into three classes:
          Graduate at 50%, Dropout at 32%, and Enrolled at 18%.
        </p>
        <ChartCard title="Class distribution" caption="Hover for exact counts">
          <ClassDonut />
        </ChartCard>
        <p className={bodyText}>
          Even before any modeling, correlating each numeric feature with a binary{" "}
          <Code>Is_Dropout</Code> flag tells most of the story. Second-semester grades and
          units passed have the strongest negative correlation with dropping out (−0.57),
          with the first-semester versions close behind. Paying tuition on time (−0.43) and
          holding a scholarship (−0.25) both track with staying. There are features that positively correlate with dropping out, such as age at enrollment (+0.25) and carrying debt (+0.23), but they are much weaker than the negatively correlated ones.
        </p>
        <ChartCard
          title="Correlation with dropout status"
          caption="Six strongest negative and positive Pearson correlations with a binary Is_Dropout flag"
        >
          <CorrelationBars />
        </ChartCard>
      </Section>

      <Section id="features" heading="Feature Engineering & Selection">
        <p className={bodyText}>
          Before modeling, we dropped three columns that carried little signal (application
          mode, nationality, application order) and built 17 new features on top of the raw
          record. Some were straightforward ratios: <Code>approval_rate_1st_sem</Code>,{" "}
          <Code>failures_2nd_sem</Code>, <Code>avg_first_sem_grade</Code>. Others tracked how
          a student moved between semesters, like <Code>grade_improvement</Code> and{" "}
          <Code>approved_units_diff</Code>, or combined signals, like a{" "}
          <Code>financial_risk_score</Code> that adds up debtor status and unpaid tuition. A
          few were interaction terms aimed squarely at the hard-to-classify Enrolled
          students, <Code>academic_risk</Code> and <Code>grade_consistency</Code>. We also ran
          K-Means (k=5, picked off the elbow plot on standardized features) and fed the
          resulting <Code>Cluster</Code> label back in as one more feature.
        </p>
        <p className={`${bodyText} mt-6`}>
          To trim all of that down, we used recursive feature elimination with
          cross-validation (RFECV with an XGBoost estimator, 5-fold stratified). It kept 43 of
          the candidate features, 10 of them engineered. Three of those,{" "}
          <Code>overall_approval_rate</Code>, <Code>failures_2nd_sem</Code>, and <Code>second_sem_pass_rate</Code> landed in the
          model&rsquo;s top five predictors.
        </p>
        <ChartCard
          title="Top 5 features (Random Forest importance)"
          caption="overall_approval_rate and failures_2nd_sem are engineered features"
        >
          <FeatureImportance />
        </ChartCard>
      </Section>

      <Section id="models" heading="Model Selection">
        <p className={bodyText}>
          We trained seven classifiers on the same 80/20 stratified split with a fixed random
          seed: Logistic Regression, Random Forest, XGBoost, a multilayer perceptron, SVC,
          K-Nearest Neighbors, and Gradient Boosting. Random Forest led at 77.7% accuracy and
          0.76 weighted F1, with XGBoost and Gradient Boosting right behind. Grid-search
          tuning nudged cross-validated accuracy to about 0.78 for both leaders but did not
          shuffle the ranking.
        </p>
        <ChartCard
          title="Comparison of model performance"
          caption="Accuracy and weighted F1 on the held-out test set"
        >
          <ModelComparison />
        </ChartCard>
        <p className={bodyText}>
          The one-vs-rest ROC curves show both leading models pulling all three classes well
          clear of chance. Dropout and Graduate come out reliable (AUC 0.91 and 0.93).
          Enrolled is the stubborn one at 0.82, which is exactly the overlap the EDA had
          already hinted at.
        </p>
        <ChartCard
          title="ROC curves (one-vs-rest)"
          caption="Random Forest solid, XGBoost dashed. Hover a curve for TPR/FPR."
        >
          <RocCurves />
        </ChartCard>
      </Section>

      <Section id="imbalance" heading="Class Imbalance & SMOTE">
        <p className={bodyText}>
          Enrolled students sit between the other two groups, so every model trips over them,
          and that overlap is the main reason three-class accuracy tops out near 77%. We tried
          four fixes: class weighting, sample weighting, threshold tuning, and SMOTE
          oversampling of the training set. SMOTE paired with the tuned Random Forest gave the
          best balance. Enrolled recall jumped from 38.4% to 51.6%, so the model now catches
          those at-risk students about a third more often, and overall accuracy slipped by
          less than two points.
        </p>
        <ChartCard
          title="Enrolled recall, before vs after SMOTE"
          caption="Same tuned Random Forest; only the training data was rebalanced"
        >
          <SmoteRecall />
        </ChartCard>
        <p className={bodyText}>
          The confusion matrix for the final model backs this up. Dropouts and graduates get
          caught reliably, and most of what is left wrong is Enrolled students getting mixed
          up with one of the other two classes.
        </p>
        <ChartCard
          title="Confusion matrix — Random Forest + SMOTE"
          caption="Hover any cell for counts and row percentages"
        >
          <ConfusionMatrix />
        </ChartCard>
      </Section>

      <Section id="binary" heading="Reframing as a Binary Flag">
        <p className={bodyText}>
          For an advising team, the practical question is just whether to step in. So we
          collapsed the problem to a single yes/no, &ldquo;will this student drop
          out?&rdquo;, and retrained the tuned Random Forest as a binary classifier. That
          version is 87% accurate and catches 80% of the students who did drop out, before
          they left. Since it outputs a probability for each student, staff can raise the
          threshold to flag more of them whenever they have room to follow up.
        </p>
      </Section>

      <Section id="limitations" heading="Limitations & Next Steps">
        <p className={bodyText}>
          This is one cohort from one school, so the flag needs testing on other student
          groups before anyone builds policy around it. The Enrolled class is still genuinely
          fuzzy, and richer mid-year data like attendance or LMS activity would probably help
          more than another round of model tuning. The next steps we would take: run the flag
          on new cohorts, give the model more to work with, and put it in front of a real
          advising team to see whether the students it flags, and the school then supports,
          actually stay enrolled.
        </p>
      </Section>
    </main>
  );
}
