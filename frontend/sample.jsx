import { useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function VideoCall({ currentChatUserId }) {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const pcRef = useRef();

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
    pcRef.current = pc;

    // Get camera + mic
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
      });

    // Remote stream
    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: currentChatUserId
        });
      }
    };

    // Receive signaling events
    socket.on("answer-call", async ({ offer, from }) => {
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { answer, to: from });
    });

    socket.on("answer", async ({ answer }) => {
      await pc.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await pc.addIceCandidate(candidate);
      } catch (e) {
        console.error(e);
      }
    });

    // Optional: join call room
    socket.emit("join-call", currentChatUserId);

  }, [currentChatUserId]);

  // Start call (caller)
  const startCall = async () => {
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socket.emit("offer", { offer, to: currentChatUserId });
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted style={{ width: "200px" }} />
      <video ref={remoteVideoRef} autoPlay style={{ width: "200px" }} />
      <button onClick={startCall}>Call</button>
    </div>
  );
}
