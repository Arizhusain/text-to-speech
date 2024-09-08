import {
    PauseFill,
    PlayFill,
} from "https://cdn.skypack.dev/react-bootstrap-icons@1.5.0";

const Control = (props) => {
    return (
        <div className="controls">
            {
                props.playState === true ?
                    <button
                        className="centerButton"
                        onClick={x => props.setPlayState(false)}>
                        <PauseFill />
                    </button> :
                    <button
                        className="centerButton"
                        onClick={x => props.setPlayState(true)}>
                        <PlayFill />
                    </button>
            }
        </div>
    );
}

export default Control
