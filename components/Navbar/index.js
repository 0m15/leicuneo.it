import { useSnapshot } from "valtio"
import { state } from "../../store"

export function Navbar({ showMainButton = true }) {

    const snap = useSnapshot(state)

    return (
        <div className="navbar padding-1">
            <div className="flex flex-space-between">
                <img width={135} height={62.5} className="logo" alt="Living Emotions in Cuneo - logo" src="/logo.svg" />
                <button className="button button-circle">?</button>
            </div>
            {showMainButton &&
                <div className="flex flex-center">
                    <button className="button button-1 text-2 button-primary" onClick={()=> {
                        state.showContentsPopover=!state.showContentsPopover
                    }}>
                        Scopri i luoghi di Cuneo
                    </button>
                </div>}
        </div>
    )
}