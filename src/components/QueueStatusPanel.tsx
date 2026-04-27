import { queueProjects } from "../data/queueProjects";

const stageStyles: Record<string, string> = {
  "Editing In Progress": "border-elevated/40 bg-elevated/10 text-elevated",
  "Shoot Completed": "border-attention/40 bg-attention/10 text-attention",
  Scheduled: "border-clear/40 bg-clear/10 text-clear",
  "Ideation Stage": "border-white/15 bg-white/10 text-bone",
};

const stageOrder = ["Editing In Progress", "Shoot Completed", "Scheduled", "Ideation Stage"];

export function QueueStatusPanel() {
  const stageCounts = stageOrder.map((stage) => ({
    stage,
    count: queueProjects.filter((project) => project.progress === stage).length,
  }));

  return (
    <section className="rounded-lg border border-white/10 bg-panel/85 p-5">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Production Queue</p>
          <h2 className="mt-2 text-2xl font-semibold text-bone">In Flight</h2>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
          {queueProjects.length} active samples
        </span>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {stageCounts.map(({ stage, count }) => (
          <div key={stage} className="rounded-md border border-white/10 bg-black/20 p-3">
            <div className="text-2xl font-semibold text-bone">{count}</div>
            <div className="mt-1 text-xs leading-4 text-muted">{stage}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {queueProjects.slice(0, 7).map((project) => (
          <article key={project.id} className="rounded-md border border-white/10 bg-black/20 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-bone">{project.projectName}</h3>
                <p className="mt-1 text-xs leading-5 text-muted">{project.personRole || "Owner TBD"}</p>
              </div>
              <span className={`rounded-full border px-2.5 py-1 text-xs ${stageStyles[project.progress] || stageStyles["Ideation Stage"]}`}>
                {project.progress}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted">
              <span>{project.shootDate ? `Shoot: ${formatDate(project.shootDate)}` : "Shoot: TBD"}</span>
              <span>{project.deliveryDate ? `Delivery: ${formatDate(project.deliveryDate)}` : "Delivery: TBD"}</span>
              <span className="col-span-2">{project.location || "Location TBD"}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
