import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import './VideoChat.css';

function VideoChat({ socket, roomId, users, onClose }) {
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }

        socket.on('webrtc-signal', ({ from, signal }) => {
          const peer = addPeer(signal, from, stream);
          peersRef.current.push({
            peerId: from,
            peer
          });

          setPeers((users) => [...users, { peerId: from, peer }]);
        });

        users.forEach((user) => {
          if (user.id !== socket.id) {
            const peer = createPeer(user.id, socket.id, stream);
            peersRef.current.push({
              peerId: user.id,
              peer
            });

            setPeers((users) => [...users, { peerId: user.id, peer }]);
          }
        });
      })
      .catch((err) => {
        console.error('Error accessing media devices:', err);
      });

    return () => {
      peersRef.current.forEach(({ peer }) => {
        peer.destroy();
      });

      if (userVideo.current && userVideo.current.srcObject) {
        userVideo.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  function createPeer(userToSignal, callerId, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });

    peer.on('signal', (signal) => {
      socket.emit('webrtc-signal', {
        roomId,
        to: userToSignal,
        signal
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    });

    peer.on('signal', (signal) => {
      socket.emit('webrtc-signal', {
        roomId,
        to: callerId,
        signal
      });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <div className="video-chat">
      <div className="video-header">
        <h3>Video Chat</h3>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="video-grid">
        <div className="video-item">
          <video ref={userVideo} autoPlay muted />
          <span className="video-label">You</span>
        </div>

        {peers.map(({ peerId, peer }) => (
          <Video key={peerId} peer={peer} peerId={peerId} users={users} />
        ))}
      </div>
    </div>
  );
}

function Video({ peer, peerId, users }) {
  const ref = useRef();

  useEffect(() => {
    peer.on('stream', (stream) => {
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    });
  }, [peer]);

  const user = users.find((u) => u.id === peerId);

  return (
    <div className="video-item">
      <video ref={ref} autoPlay />
      <span className="video-label">{user?.username || 'User'}</span>
    </div>
  );
}

export default VideoChat;
