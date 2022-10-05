import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import io from "socket.io-client";

const Dashboard = () => {
  const socket = io.connect("http://localhost:3001/");

  const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [listofCoords, setListofCoords] = useState({});
  socket.on("checkcoords", (data) => {
    setListofCoords(data);
  });
  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("checkcoords", (data) => {
      setListofCoords(data);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
  }, [socket]);

  const cookies = new Cookies();
  const user = cookies.get("user");
  useEffect(() => {
    const handleWindowMouseMove = (event) => {
      setGlobalCoords({
        x: event.screenX,
        y: event.screenY,
      });
    };
    window.addEventListener("mousemove", handleWindowMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
    };
  }, []);
  useEffect(() => {
    var coords = { coords: globalCoords, user: user.email };
    socket.emit("sendcoords", JSON.stringify(coords));
    socket.on("checkcoords", (data) => {
      setListofCoords(data);
    });
    console.log(listofCoords);
  }, [globalCoords, socket, listofCoords, user]);
  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };
  const LogEvent = (e) => {
    var log = {
      event: {
        altKey: e.altKey,
        clientX: e.clientX,
        clientY: e.clientY,
        ctrlKey: e.ctrlKey,
        defaultPrevented: e.defaultPrevented,
        nativeEvent: e.nativeEvent,
        screenX: e.screenX,
        screenY: e.screenY,
        shiftKey: e.shiftKey,
        target: e.target,
        type: e.type,
        view: e.view,
        _reactName: e._reactName,
      },
      user: user.email,
    };
    socket.emit("event", JSON.stringify(log, getCircularReplacer()));
  };
  if (user) {
    return (
      <div className="container">
        <div className="container">
          <div className="row">
            <div className="col-6 text-start">
              Connection Status : {isConnected ? "🟢" : "🔴"}
            </div>
            <div className="col-6 text-end">
              <button
                onClick={() => {
                  cookies.remove("user");
                  window.location.replace("/");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <h4>
              Your Global coords: {globalCoords.x} x {globalCoords.y}
            </h4>
            <button
              id="buttonone"
              className="btn btn-primary"
              onClick={(e) => LogEvent(e)}
              onDoubleClick={(e) => LogEvent(e)}
              onMouseOut={(e) => LogEvent(e)}
              onMouseOver={(e) => LogEvent(e)}
            >
              Button 1
            </button>
            <button
              id="buttontwo"
              className="btn btn-secondary"
              onClick={(e) => LogEvent(e)}
              onDoubleClick={(e) => LogEvent(e)}
              onMouseOut={(e) => LogEvent(e)}
              onMouseOver={(e) => LogEvent(e)}
            >
              Button 2
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {Object.keys(listofCoords).map((key) => {
              return (
                <p>
                  {key} - {listofCoords[key].x + " x " + listofCoords[key].y}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else {
    cookies.remove("user");
    window.location.replace("/");
  }
};
export default Dashboard;
