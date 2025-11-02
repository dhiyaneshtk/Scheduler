import { CheckCircle2, Circle } from "lucide-react";
import "./Progress.css";

const Progress = () => {
  const progressData = {
    immersions: {
      completed: 3,
      total: 4,
      items: ["Global", "Social", "Ethical", "Artistic"],
      done: ["Global", "Social", "Ethical"],
    },
    perspectives: {
      items: [
        { name: "Social", done: true },
        { name: "Ethical", done: true },
        { name: "Artistic", done: false },
        { name: "Global", done: true },
      ],
    },
    minor: {
      status: "Undeclared",
    },
    core: {
      remaining: 8,
      total: 12,
    },
  };

  const getProgressPercentage = (completed, total) => {
    return (completed / total) * 100;
  };

  return (
    <div className="progress-container">
      <h1 className="progress-title">Academic Progress</h1>

      <div className="progress-sections">
        <div className="progress-card glass">
          <h2 className="section-title">Immersions</h2>
          <div className="progress-stat">
            <span className="stat-value">
              {progressData.immersions.completed}/{progressData.immersions.total}
            </span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${getProgressPercentage(
                  progressData.immersions.completed,
                  progressData.immersions.total
                )}%`,
              }}
            />
          </div>
          <div className="items-list">
            {progressData.immersions.items.map((item) => (
              <div key={item} className="item-row">
                {progressData.immersions.done.includes(item) ? (
                  <CheckCircle2 size={18} className="icon-done" />
                ) : (
                  <Circle size={18} className="icon-pending" />
                )}
                <span className={progressData.immersions.done.includes(item) ? "done" : ""}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="progress-card glass">
          <h2 className="section-title">Perspectives</h2>
          <div className="items-list">
            {progressData.perspectives.items.map((item) => (
              <div key={item.name} className="item-row">
                {item.done ? (
                  <CheckCircle2 size={18} className="icon-done" />
                ) : (
                  <Circle size={18} className="icon-pending" />
                )}
                <span className={item.done ? "done" : ""}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="progress-card glass">
          <h2 className="section-title">Minor Status</h2>
          <div className="status-badge">
            <span className="status-text">{progressData.minor.status}</span>
          </div>
        </div>

        <div className="progress-card glass">
          <h2 className="section-title">Core Courses</h2>
          <div className="progress-stat">
            <span className="stat-value">
              {progressData.core.remaining}
            </span>
            <span className="stat-label">Remaining</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${getProgressPercentage(
                  progressData.core.total - progressData.core.remaining,
                  progressData.core.total
                )}%`,
              }}
            />
          </div>
          <p className="progress-text">
            {progressData.core.total - progressData.core.remaining} of{" "}
            {progressData.core.total} completed
          </p>
        </div>
      </div>
    </div>
  );
};

export default Progress;
