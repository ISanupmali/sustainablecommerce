import React, { useEffect, useRef, useState } from 'react';
import * as cam from "@mediapipe/camera_utils";
import * as mediapipePose from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Pose } from "@mediapipe/pose";
import Navbar from './components/navbar';
import Webcam from 'react-webcam';
import { useHistory } from 'react-router-dom';

const UserPose = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const squatCountRef = useRef(0);
    const [squatCount, setSquatCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(10);
    const [prevSquatState, setPrevSquatState] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    let camera = null;
    const history = useHistory();

    function onResults(results) {
        if (!results.poseLandmarks) {
            return;
        }

        canvasRef.current.width = webcamRef.current.video.videoWidth;
        canvasRef.current.height = webcamRef.current.video.videoHeight;
        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext("2d");
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

        drawConnectors(canvasCtx, results.poseLandmarks, mediapipePose.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
        drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });

        const requiredLandmarks = [23, 24, 25, 26, 27, 28];
        const allLandmarksInView = requiredLandmarks.every(index => {
            const landmark = results.poseLandmarks[index];
            return landmark.x >= 0 && landmark.x <= 1 && landmark.y >= 0 && landmark.y <= 1;
        });

        if (!allLandmarksInView) {
            return;
        }

        const leftHip = results.poseLandmarks[23];
        const rightHip = results.poseLandmarks[24];
        const leftKnee = results.poseLandmarks[25];
        const rightKnee = results.poseLandmarks[26];
        const leftAnkle = results.poseLandmarks[27];
        const rightAnkle = results.poseLandmarks[28];

        const isSquat = (landmark1, landmark2, landmark3) => {
            const angle = Math.abs(
                Math.atan2(landmark3.y - landmark2.y, landmark3.x - landmark2.x) -
                Math.atan2(landmark1.y - landmark2.y, landmark1.x - landmark2.x)
            ) * (180 / Math.PI);
            return angle < 90;
        };

        const squatState = isSquat(leftHip, leftKnee, leftAnkle) && isSquat(rightHip, rightKnee, rightAnkle);

        if (squatState && !prevSquatState) {
            squatCountRef.current += 1;
            setSquatCount(squatCountRef.current);
            if (squatCountRef.current === 10) {
                setShowMessage(true);
                camera.stop();
            }
        }

        setPrevSquatState(squatState);

        canvasCtx.font = '60px Arial';
        canvasCtx.fillStyle = 'red';
        canvasCtx.fillText(`Squats: ${squatCountRef.current}`, 10, 50);
        canvasCtx.restore();
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown <= 1) {
                    clearInterval(timer);
                    setLoading(false);
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        const userPose = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
            },
        });
        userPose.setOptions({
            maxNumFaces: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });
        userPose.onResults(onResults);
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null
        ) {
            camera = new cam.Camera(webcamRef.current.video, {
                onFrame: async () => {
                    if (!loading) {
                        await userPose.send({ image: webcamRef.current.video });
                    }
                },
                width: 1280,
                height: 720,
            });
            camera.start();
        }
    }, [loading]);

    // Function to handle back button click
    const handleBack = () => {
        history.goBack(); // Go back to the previous page
    };

    return (
        <div>
            {loading && (
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "48px",
                    zIndex: 10,
                    textAlign: "center"
                }}>
                    <div>Step at least 10 feet away from the Camera.</div>
                    <div>This will allow our app to detect your Squats</div>
                    <div>Starting in {countdown}...</div>
                </div>
            )}
            <Webcam
                ref={webcamRef}
                style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zIndex: 9,
                    width: "100%",
                    height: "auto",
                }}
            />
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zIndex: 9,
                    width: "100%",
                    height: "auto",
                }}
            />
            {showMessage && (
                <div style={{
                    position: "absolute",
                    top: "20%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    padding: "100px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    textAlign: "center",
                    zIndex: 11,
                }}>
                    
                    <h2>Congratulations!</h2>
                    <p>You have won 20% Off for your next order</p>
                    <p>Coupon Code: <strong>rT5MrzqI6tSQLEku94gYg</strong></p>
                    <button style={styles.backButton} onClick={handleBack}>Go Back</button>
                </div>
            )}
        </div>
    );
};

// Styles for different UI elements
const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      padding: '20px'
    },
    button: {
      marginTop: '20px',
      padding: '10px 20px',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    backButton: {
      marginTop: '20px',
      marginBottom: '5px',
      padding: '10px 20px',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundColor: '#6c757d',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    result: {
      marginTop: '20px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333'
    }
  };

export default UserPose;
