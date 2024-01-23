import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function CircleBar({ value }) {
  return (
    <div className="circle-bar">
      <CircularProgressbar
        value={value}
        text={`${value}%`}
        styles={buildStyles({
          trailColor: "rgba(0, 0, 0, 0.25)",
          pathColor: "#ADFF00",
          textColor: '#000',
        })}
      />
    </div>
  );
}

export default CircleBar;
