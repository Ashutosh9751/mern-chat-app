 useEffect(() => {
    if (!socket) return;

    // Incoming call
  //   socket.on("call-made", async ({ offer, from }) => {

  //     setisvideoscreen(true);
  //     const configuration = {
  //       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  //     };
  //     pcRef.current = new RTCPeerConnection(configuration);
  //     pcRef.current.ontrack = (event) => {

  //       if (remotevideoref.current) {
  //         remotevideoref.current.srcObject = event.streams[0];
  //         remotevideoref.current.play().catch(console.error);
  //       }
  //     };
  //     await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer)); // or answer
  //     // Immediately after:
  //     if (candidateQueue.current.length > 0) {
  //       for (const candidate of candidateQueue.current) {
  //         try {
  //           await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
  //         } catch (e) {
  //           console.error("❌ Error adding queued ICE candidate:", e);
  //         }
  //       }
  //       candidateQueue.current = [];
  //     }


  //     // Remote stream handler


  //     const cameras = await getConnectedDevices("videoinput");

  //     if (cameras && cameras.length > 0) {
  //       const stream = await openCamera(cameras[0].deviceId);

  //       stream.getTracks().forEach((track) => {
  //         pcRef.current.addTrack(track, stream);
  //       });

  //       if (localvideoref.current) {
  //         localvideoref.current.srcObject = stream;
  //       }





  //       const answer = await pcRef.current.createAnswer();
  //       await pcRef.current.setLocalDescription(answer);

  //       pcRef.current.onicecandidate = (event) => {
  //         if (event.candidate) {
  //           socket.emit("send-ice-candidate", {
  //             candidate: event.candidate,
  //             to: from,
  //           });
  //         }
  //       };

  //       socket.emit("make-answer", {
  //         answer,
  //         to: from,
  //       });

  //     }
  //   });

  //   // Receiving an answer
  //   socket.on("answer-made", async ({ answer }) => {
  //     if (answer && pcRef.current) {
  //       try {
  //         await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
  //         // Immediately drain ICE candidate queue after setting remoteDescription
  //         if (candidateQueue.current.length > 0) {
  //           for (const candidate of candidateQueue.current) {
  //             try {
  //               await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
  //             } catch (e) {
  //               console.error("❌ Error adding queued ICE candidate:", e);
  //             }
  //           }
  //           candidateQueue.current = [];
  //         }
  //       } catch (err) {
  //         console.error("Error setting remote description:", err);
  //       }
  //     }
  //   });


  //   // Receiving ICE candidate
  //   socket.on("received-ice-candidate", async ({ candidate }) => {
  //     if (pcRef.current) {
  //       if (pcRef.current.remoteDescription) {
  //         try {
  //           await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));

  //         } catch (err) {
  //           console.error("❌ Error adding ICE candidate", err);
  //         }
  //       } else {
  //         console.warn("⚠️ Queued ICE candidate (no remoteDescription yet)");
  //         candidateQueue.current.push(candidate);
  //       }
  //     }
  //   });


  //   return () => {
  //     socket.off("call-made");
  //     socket.off("make-answer");
  //     socket.off("received-ice-candidate");
  //   };
  // }, []);


    // useEffect(() => {
    //   if (!socket) return;
  
    //   // Incoming call
    //   socket.on("call-made", async ({ offer, from }) => {
  
    //     setisvideoscreen(true);
    //     const configuration = {
    //       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    //     };
    //     pcRef.current = new RTCPeerConnection(configuration);
    //     pcRef.current.ontrack = (event) => {
  
    //       if (remotevideoref.current) {
    //         remotevideoref.current.srcObject = event.streams[0];
    //         remotevideoref.current.play().catch(console.error);
    //       }
    //     };
    //     await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer)); // or answer
    //     // Immediately after:
    //     if (candidateQueue.current.length > 0) {
    //       for (const candidate of candidateQueue.current) {
    //         try {
    //           await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    //         } catch (e) {
    //           console.error("❌ Error adding queued ICE candidate:", e);
    //         }
    //       }
    //       candidateQueue.current = [];
    //     }
  
  
    //     // Remote stream handler
  
  
    //     const cameras = await getConnectedDevices("videoinput");
  
    //     if (cameras && cameras.length > 0) {
    //       const stream = await openCamera(cameras[0].deviceId);
  
    //       stream.getTracks().forEach((track) => {
    //         pcRef.current.addTrack(track, stream);
    //       });
  
    //       if (localvideoref.current) {
    //         localvideoref.current.srcObject = stream;
    //       }
  
  
  
  
  
    //       const answer = await pcRef.current.createAnswer();
    //       await pcRef.current.setLocalDescription(answer);
  
    //       pcRef.current.onicecandidate = (event) => {
    //         if (event.candidate) {
    //           socket.emit("send-ice-candidate", {
    //             candidate: event.candidate,
    //             to: from,
    //           });
    //         }
    //       };
  
    //       socket.emit("make-answer", {
    //         answer,
    //         to: from,
    //       });
  
    //     }
    //   });
  
    //   // Receiving an answer
    //   socket.on("answer-made", async ({ answer }) => {
    //     if (answer && pcRef.current) {
    //       try {
    //         await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    //         // Immediately drain ICE candidate queue after setting remoteDescription
    //         if (candidateQueue.current.length > 0) {
    //           for (const candidate of candidateQueue.current) {
    //             try {
    //               await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    //             } catch (e) {
    //               console.error("❌ Error adding queued ICE candidate:", e);
    //             }
    //           }
    //           candidateQueue.current = [];
    //         }
    //       } catch (err) {
    //         console.error("Error setting remote description:", err);
    //       }
    //     }
    //   });
  
  
    //   // Receiving ICE candidate
    //   socket.on("received-ice-candidate", async ({ candidate }) => {
    //     if (pcRef.current) {
    //       if (pcRef.current.remoteDescription) {
    //         try {
    //           await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
  
    //         } catch (err) {
    //           console.error("❌ Error adding ICE candidate", err);
    //         }
    //       } else {
    //         console.warn("⚠️ Queued ICE candidate (no remoteDescription yet)");
    //         candidateQueue.current.push(candidate);
    //       }
    //     }
    //   });
  
  
    
    // }, []);
  
    // useEffect(() => {
    //   if (pcRef.current?.remoteDescription && candidateQueue.current.length > 0) {
    //     candidateQueue.current.forEach(async (c) => {
    //       await pcRef.current.addIceCandidate(new RTCIceCandidate(c));
    //     });
    //     candidateQueue.current = [];
    //   }
    // }, [pcRef.current?.remoteDescription]);