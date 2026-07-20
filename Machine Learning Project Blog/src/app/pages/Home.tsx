import { Link } from "react-router";
import Code from "../components/Code";
import MetricTiles from "../components/MetricTiles";
import ChartCard from "../components/charts/ChartCard";
import ClassDonut from "../components/charts/ClassDonut";
import FeatureImportance from "../components/charts/FeatureImportance";
import ModelComparison from "../components/charts/ModelComparison";
import SmoteRecall from "../components/charts/SmoteRecall";

const GITHUB_URL = "https://github.com/Hmcg23/student_dropout_project";

function Hero() {
  return (
    <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 border-b border-border">
      <h1 className="font-['Lora'] text-4xl md:text-5xl font-semibold leading-[1.15] tracking-tight text-foreground mb-6">
        Predicting Student Dropouts Before It's Too Late
      </h1>

      <p className="font-['DM_Sans'] text-lg text-muted-foreground leading-relaxed mb-10 font-light">
        Using first-year academic, demographic, and socioeconomic data to flag at-risk
        students early enough to help them.
      </p>

      <div className="flex flex-wrap items-center gap-6 text-sm font-['DM_Sans'] text-muted-foreground">
        <span>Hudson McGough</span>
        <span className="w-px h-3 bg-border" />
        <time dateTime="2026-07-18">July 2026</time>
        <span className="w-px h-3 bg-border" />
        <span>4 min read</span>
        <span className="w-px h-3 bg-border" />
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="text-foreground border-b border-crimson hover:text-muted-foreground transition-colors"
        >
          View Code →
        </a>
      </div>
    </section>
  );
}

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

const bodyText = "font-['DM_Sans'] text-base leading-[1.85] text-foreground font-light";

function MethodologyLink() {
  return (
    <p className="mt-4">
      <Link
        to="/methodology"
        className="font-['DM_Sans'] text-sm text-foreground border-b border-crimson hover:text-muted-foreground transition-colors"
      >
        Full methodology →
      </Link>
    </p>
  );
}

export default function Home() {
  return (
    <main>
      <Hero />
      <MetricTiles />

      <Section id="abstract" heading="Abstract & Summary">
        <p className={bodyText}>
          About one in three students in this dataset never finished their degree. By the
          time someone formally drops out, the warning signs have usually been visible for
          months. The question we set out to answer: can a school spot those students early
          enough to actually do something about it? The data covers 4,424 students from the
          UCI &ldquo;Predict Students&rsquo; Dropout and Academic Success&rdquo; dataset, and
          we trained models to sort each one into Dropout, Enrolled, or Graduate from their
          first-year record alone. The best of them, a tuned Random Forest, reaches 77.7%
          accuracy across all three classes. Reframed as a plain yes/no dropout flag it hits
          87% and catches 80% of the students who actually left. All of the strongest
          predictors are <u>first-year academic performance</u>, so the risk is visible by the end
          of year one, while there is still time to act.
        </p>
      </Section>

      <Section id="data" heading="The Data">
        <p className={bodyText}>
          Each student record mixes three kinds of information: academic performance (grades
          and classes passed or failed each semester), demographics (age, prior schooling,
          course of study), and socioeconomic signals (tuition status, scholarship, financial
          aid). The outcomes are lopsided. Half the students graduate, a third drop out, and
          the smallest group, the ones still enrolled, is also the hardest to call, because
          mid-trajectory students look like both future graduates and future dropouts.
        </p>
        <ChartCard
          title="Student outcomes"
          caption="4,424 students · Hover for exact counts."
        >
          <ClassDonut />
        </ChartCard>
        <MethodologyLink />
      </Section>

      <Section id="predictors" heading="What Actually Predicts Dropout">
        <p className={bodyText}>
          The top five predictors, ranked by the Random Forest&rsquo;s feature importance,
          are all academic: how many classes a student passes in the first year. Three of them
          aren&rsquo;t raw dataset columns but features we built ourselves,{" "}
          <Code>overall_approval_rate</Code>, <Code>failures_2nd_sem</Code>, and <Code>second_sem_pass_rate</Code>. Age, gender,
          and parental occupation counted for far less than we initially thought! Therefore, the fix is an academic one: <u>tutoring and early check-ins for students falling behind in their first-year
          classes.</u>
        </p>
        <ChartCard
          title="Top 5 features influencing dropout"
          caption="Random Forest feature importance. Hover for exact values."
        >
          <FeatureImportance />
        </ChartCard>
        <MethodologyLink />
      </Section>

      <Section id="results" heading="Results">
        <p className={bodyText}>
          We tested seven classifiers on an 80/20 stratified split. Random Forest came out on
          top at 77.7% accuracy and 0.76 weighted F1, just ahead of XGBoost and Gradient
          Boost. The number that mattered to us was recall: how many at-risk students the
          model actually catches. To push it up, we rebalanced the training set with SMOTE,
          which <u>raised recall on the Enrolled class from 38.4%to 51.6% while barely
          touching overall accuracy</u>.
        </p>
        <ChartCard
          title="Model comparison"
          caption="Accuracy and weighted F1 on the held-out test set. Hover any bar."
        >
          <ModelComparison />
        </ChartCard>
        <ChartCard
          title="Catching Enrolled students"
          caption="Recall on the Enrolled class, before and after SMOTE rebalancing"
        >
          <SmoteRecall />
        </ChartCard>
        <MethodologyLink />
      </Section>

      <Section id="takeaways" heading="Takeaways">
        <div className="space-y-6">
          {[
            {
              title: "Risk is visible early",
              body: "Every top predictor is first-year academic performance. A school doesn't have to wait for a student to fail out; the signal is already there by the end of year one.",
            },
            {
              title: "The signal is academic",
              body: "It comes down to whether students pass their classes. That points to a specific response: tutoring and mandatory check-ins for anyone with a low first-semester pass rate.",
            },
            {
              title: "A reliable yes/no flag",
              body: "Asked as a yes/no question, will this student drop out, the model is 87% accurate and catches 80% of the students who actually left. Because it outputs a probability for each student, staff can (and in many cases, should) turn the sensitivity up to flag more of them whenever they have the capacity to follow up.",
            },
          ].map((t) => (
            <div key={t.title}>
              <h3 className="font-['DM_Mono'] text-xs tracking-widest uppercase text-muted-foreground mb-2">
                {t.title}
              </h3>
              <p className={bodyText}>{t.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="code" heading="Code">
        <p className="font-['DM_Sans'] text-base leading-relaxed text-muted-foreground mb-6 font-light">
          The exploratory analysis, feature engineering, model selection, SMOTE experiments, and the evaluation code all live in a Jupyter notebook on Github.
        </p>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="block border border-foreground rounded-sm p-6 hover:bg-foreground hover:text-background transition-colors group"
        >
          <p className="font-['DM_Mono'] text-xs tracking-widest uppercase mb-2 text-muted-foreground group-hover:text-background/70">
            github.com/Hmcg23
          </p>
          <p className="font-['Lora'] text-xl font-semibold">
            student_dropout_project →
          </p>
        </a>
      </Section>

      <Section id="references" heading="References">
        <ol className="space-y-3">
          <li className="font-['DM_Sans'] text-sm text-muted-foreground leading-relaxed font-light">
            [1] Realinho, V., Vieira Martins, M., Machado, J., &amp; Baptista, L. (2021).
            Predict Students&rsquo; Dropout and Academic Success (Dataset 697). UCI Machine
            Learning Repository.
          </li>
        </ol>
      </Section>
    </main>
  );
}
