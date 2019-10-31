import React, {useState} from "react";

/**
 *
 * @props
 * time - Total expo length
 * count - Total number of projects
 */

export default function JudgingTimes(props) {
    const [judges, setJudges] = useState(1);

    if (props.count === 0) {
        return "You have no projects to judge."
    }

    const plural = judges === 1 ? "judge" : "judges";
    const time = (props.time / props.count) * judges;

    return (
    <div className="card">
        You have {props.count} projects to judge in {props.time} minutes. <br/>
        <div className="nowrap">Given <input className="inline-numinput" type="number" id="numJudges" name="judges" min="1" value={judges} onChange={(e) => {setJudges(parseInt(e.target.value))}} /> {plural}, each judge can spend about {time.toFixed(1)} minutes per hack.</div>
    </div>);
}