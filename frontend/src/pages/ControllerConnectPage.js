
import '../styles/ControllerConnect.css'

export default function ControllerConnectPage() {

    return (
        <div className="controller-connect-container">

            <div className="controller-connect-header">
                <span>Waiting for controller connection...</span>
            </div>

            <div className="controller-connect-players-container">
            <div className="player">
                <div className='player-card'>

                </div>
                <button className="player-description">
                    Player #
                </button>
            </div>
            </div>

            <div className="controller-connect-footer">
                <button className='controller-submit'>Done</button>
            </div>

        </div>
    )

}