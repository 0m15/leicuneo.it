import { useSnapshot } from "valtio";
import { state } from "../../store";

export function Navbar({ showMainButton = true }) {
  const snap = useSnapshot(state);

  return (
    <>
      <div className="navbar padding-1">
        <div className="flex flex-space-between">
          <img
            width={135}
            height={62.5}
            className="logo"
            alt="Living Emotions in Cuneo - logo"
            src="/logo.svg"
            style={{ marginTop: -16 }}
          />
          <button
            className="button button-circle"
            onClick={() => {
              state.showInfo = true;
            }}
          >
            ?
          </button>
        </div>
        {showMainButton && (
          <div className="flex flex-center">
            <button
              className="button button-1 text-2 button-primary"
              onClick={() => {
                state.showContentsPopover = !state.showContentsPopover;
              }}
            >
              Scopri i luoghi di Cuneo
            </button>
          </div>
        )}
      </div>
      {snap.showInfo && (
        <div
          onClick={() => {
            state.showInfo = false;
          }}
          className="flex flex-center flex-column"
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(0,0,0,.5)",
            zIndex: 9999,
          }}
        >
          <div
            className="padding-1 bg-white"
            style={{
              borderRadius: 4,
            }}
          >
            <div className="flex w-100">
              <div className="pr-1">
                <p className="text-4  pb-1">Un progetto di:</p>
                <img src="/cuadri-logo.png" width={32}></img>
              </div>
              <div>
                <p className="text-4  pb-1">Con la collaborazione di:</p>
                <img src="/fcrc-logo.png" width={200}></img>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
