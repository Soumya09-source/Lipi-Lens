import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Camera,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  X,
  AlertCircle,
  FileCheck,
  Sparkles,
  RotateCcw,
  RefreshCw,
  Check
} from "lucide-react";
import { useDocument, SAMPLE_DOCUMENTS } from "../context/DocumentContext";
import { extractOCR, translateText } from "../services/api";

export default function ImageUpload({ onExtractSuccess, isExtracting, setIsExtracting }) {
  const {
    uploadedFile,
    setUploadedFile,
    filePreview,
    setFilePreview,
    setExtractedText,
    setTranslatedText,
    setDocumentName,
    loadSampleDocument,
    showToast
  } = useDocument();

  // Upload mode: "file" | "camera"
  const [uploadMode, setUploadMode] = useState("file");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  // Camera states
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [facingMode, setFacingMode] = useState("environment"); // Prefer rear camera on mobile
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedBlob, setCapturedBlob] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const processingRef = useRef(false);

  const supportedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (_e) {
          // Track stopped
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setCameraLoading(false);
  };

  // Stop camera media tracks on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async (facing = facingMode) => {
    setCameraError("");
    setCameraLoading(true);
    setCapturedImage(null);
    setCapturedBlob(null);

    // Verify browser support for getUserMedia
    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraError("ನಿಮ್ಮ ಬ್ರೌಸರ್ ಕ್ಯಾಮೆರಾ ಪ್ರವೇಶವನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ (Camera API is not supported in this browser).");
      setCameraLoading(false);
      return;
    }

    // Stop any active stream first
    stopCamera();

    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });
      } catch (idealErr) {
        // Fallback to basic video constraint
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            .play()
            .then(() => {
              setIsStreaming(true);
              setCameraLoading(false);
            })
            .catch((playErr) => {
              console.warn("Video play interrupted:", playErr);
              setIsStreaming(true);
              setCameraLoading(false);
            });
        };
      }

      // Check if multiple camera devices exist
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === "videoinput");
        setHasMultipleCameras(videoInputs.length > 1);
      } catch (devErr) {
        setHasMultipleCameras(false);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraLoading(false);
      setIsStreaming(false);

      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("ಕ್ಯಾಮೆರಾ ಪ್ರವೇಶ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ (Camera permission was denied. Please allow camera access in your browser settings).");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("ಯಾವುದೇ ಕ್ಯಾಮೆರಾ ಸಾಧನ ಪತ್ತೆಯಾಗಿಲ್ಲ (No camera device detected on your system).");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setCameraError("ಕ್ಯಾಮೆರಾ ಲಭ್ಯವಿಲ್ಲ ಅಥವಾ ಮತ್ತೊಂದು ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಬಳಕೆಯಲ್ಲಿದೆ (Camera is unavailable or in use by another application).");
      } else {
        setCameraError(`ಕ್ಯಾಮೆರಾ ದೋಷ: ${err.message || "ಕ್ಯಾಮೆರಾ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ"}`);
      }
    }
  };

  const switchCamera = () => {
    const newFacing = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newFacing);
    startCamera(newFacing);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    setCapturedImage(dataUrl);

    canvas.toBlob(
      (blob) => {
        setCapturedBlob(blob);
      },
      "image/jpeg",
      0.95
    );

    try {
      video.pause();
    } catch (e) {
      // Ignore pause failure
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCapturedBlob(null);

    if (videoRef.current && streamRef.current) {
      try {
        videoRef.current.play();
      } catch (e) {
        startCamera(facingMode);
      }
    } else {
      startCamera(facingMode);
    }
  };

  const handleUseCapturedPhoto = () => {
    if (!capturedBlob && !capturedImage) return;

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, "-");
    const fileName = `lipi_camera_doc_${dateStr}_${timeStr}.jpg`;

    stopCamera();
    setUploadMode("file");

    if (capturedBlob) {
      const file = new File([capturedBlob], fileName, { type: "image/jpeg" });
      handleFileProcess(file);
      showToast("ಕ್ಯಾಮೆರಾ ಫೋಟೋವನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ. OCR ಪ್ರಕ್ರಿಯೆ ಪ್ರಾರಂಭವಾಗಿದೆ...", "success");
    } else if (capturedImage) {
      fetch(capturedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], fileName, { type: "image/jpeg" });
          handleFileProcess(file);
          showToast("ಕ್ಯಾಮೆರಾ ಫೋಟೋವನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ. OCR ಪ್ರಕ್ರಿಯೆ ಪ್ರಾರಂಭವಾಗಿದೆ...", "success");
        })
        .catch((err) => {
          console.error("Blob conversion error:", err);
          setErrorMessage("ಫೋಟೋ ಸಂಸ್ಕರಣೆ ವಿಫಲವಾಗಿದೆ");
        });
    }
  };

  const handleCloseCamera = () => {
    stopCamera();
    setUploadMode("file");
    setCameraError("");
    setCapturedImage(null);
    setCapturedBlob(null);
  };

  // General File Handling Workflow
  const handleFileProcess = async (file) => {
    if (!file || processingRef.current) return;

    if (!supportedTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|pdf)$/i)) {
      setErrorMessage("ದಯವಿಟ್ಟು JPG, PNG ಅಥವಾ PDF ಕಡತಗಳನ್ನು ಮಾತ್ರ ಆಯ್ಕೆಮಾಡಿ (Only JPG, PNG or PDF files are supported).");
      showToast("ಅಸಮರ್ಥಿತ ಕಡತ ಮಾದರಿ. JPG, PNG ಅಥವಾ PDF ಬಳಸಿ.", "warning");
      return;
    }

    processingRef.current = true;
    setErrorMessage("");
    setExtractedText("");
    setTranslatedText("");
    setUploadedFile(file);
    setDocumentName(file.name);

    // Create preview if image
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }

    // Trigger OCR extraction
    await triggerOCR(file);
  };

  const triggerOCR = async (file) => {
    setIsExtracting(true);
    setUploadProgress(0);

    try {
      const result = await extractOCR(file, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      if (!result.success) {
        setErrorMessage(result.error || "ಪಠ್ಯ ಹೊರತೆಗೆಯುವಿಕೆ ವಿಫಲವಾಗಿದೆ");
        showToast(result.error || "OCR ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ದೋಷ ಕಂಡುಬಂದಿದೆ", "error");
        return;
      }

      if (!result.text.trim()) {
        const message = "ಚಿತ್ರದಲ್ಲಿ ಕನ್ನಡ ಪಠ್ಯವನ್ನು ಗುರುತಿಸಲಾಗಲಿಲ್ಲ";
        setErrorMessage(message);
        showToast(message, "warning");
        return;
      }

      setUploadProgress(100);
      setExtractedText(result.text);
      if (onExtractSuccess) onExtractSuccess(result.text);

      setIsExtracting(false);
      setIsTranslating(true);
      const translation = await translateText(result.text, "kn", "en");
      if (translation.success && translation.translatedText) {
        setTranslatedText(translation.translatedText);
        showToast("ಕನ್ನಡ OCR ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಅನುವಾದ ಯಶಸ್ವಿಯಾಗಿದೆ!", "success");
      } else {
        setTranslatedText("");
        const message = `OCR ಯಶಸ್ವಿಯಾಗಿದೆ; ಅನುವಾದ ವಿಫಲವಾಗಿದೆ: ${translation.error || "ಅನುವಾದ ಲಭ್ಯವಿಲ್ಲ"}`;
        setErrorMessage(message);
        showToast(message, "error");
      }
    } catch (err) {
      console.error("OCR extraction failed:", err);
      setErrorMessage("ದಾಖಲೆಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ");
      showToast("OCR ಪ್ರಕ್ರಿಯೆ ವಿಫಲವಾಗಿದೆ", "error");
    } finally {
      setIsTranslating(false);
      setIsExtracting(false);
      processingRef.current = false;
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    if (processingRef.current) return;

    setUploadedFile(null);
    setFilePreview(null);
    setUploadProgress(0);
    setErrorMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    showToast("ಕಡತವನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿದೆ", "info");
  };

  return (
    <div className="upload-container">
      {/* Hidden File Input for Browser Picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileProcess(e.target.files[0])}
        accept=".jpg,.jpeg,.png,.pdf"
        style={{ display: "none" }}
      />

      {/* 1. Upload Option Selector Tabs (Upload File vs Take Picture) */}
      {!uploadedFile && (
        <div className="upload-mode-selector">
          <button
            type="button"
            className={`upload-mode-btn ${uploadMode === "file" ? "active" : ""}`}
            onClick={() => {
              stopCamera();
              setUploadMode("file");
              setCameraError("");
            }}
          >
            <Upload size={16} />
            <span>Upload File (ಕಡತ ಅಪ್‌ಲೋಡ್)</span>
          </button>
          <button
            type="button"
            className={`upload-mode-btn ${uploadMode === "camera" ? "active" : ""}`}
            onClick={() => {
              setUploadMode("camera");
              startCamera();
            }}
          >
            <Camera size={16} />
            <span>Take Picture (ಕ್ಯಾಮೆರಾ / ಫೋಟೋ)</span>
          </button>
        </div>
      )}

      {/* 2. Main Upload View / Camera View / File Preview Card */}
      {!uploadedFile ? (
        uploadMode === "camera" ? (
          /* Live Camera Viewfinder Interface */
          <div className="camera-viewfinder-container">
            {/* Top Toolbar */}
            <div className="camera-top-controls">
              <span className="badge badge-gold" style={{ background: "rgba(0,0,0,0.7)", color: "var(--color-gold)", border: "1px solid rgba(244,197,66,0.4)" }}>
                {capturedImage ? "Photo Captured (ಪರಿಶೀಲಿಸಿ)" : "Live Camera (ನೇರ ಕ್ಯಾಮೆರಾ)"}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {hasMultipleCameras && !capturedImage && (
                  <button
                    type="button"
                    onClick={switchCamera}
                    className="btn btn-secondary btn-sm"
                    style={{ background: "rgba(0,0,0,0.7)", color: "#FFF", borderColor: "#555" }}
                    title="Switch Camera (ಕ್ಯಾಮೆರಾ ಬದಲಾಯಿಸಿ)"
                  >
                    <RefreshCw size={14} />
                    <span>Flip</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCloseCamera}
                  className="btn-icon-only btn-secondary"
                  style={{ background: "rgba(0,0,0,0.7)", color: "#FFF", borderColor: "#555" }}
                  title="Close Camera (ಕ್ಯಾಮೆರಾ ಮುಚ್ಚಿ)"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Video Feed / Captured Preview Display */}
            <div className="camera-video-wrapper">
              {cameraLoading && (
                <div style={{ textAlign: "center", color: "#FFF", padding: 40 }}>
                  <Sparkles size={28} className="spinning" style={{ color: "var(--color-gold)", margin: "0 auto 10px" }} />
                  <div>ಕ್ಯಾಮೆರಾ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ... (Starting camera...)</div>
                </div>
              )}

              {cameraError && (
                <div className="camera-error-banner" style={{ margin: 20 }}>
                  <AlertCircle size={24} color="var(--color-danger)" />
                  <div style={{ fontSize: 13, color: "var(--color-text-main)", lineHeight: 1.6 }}>
                    {cameraError}
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                    <button
                      type="button"
                      onClick={() => startCamera(facingMode)}
                      className="btn btn-secondary btn-sm"
                    >
                      <RotateCcw size={14} />
                      <span>Try Again (ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        stopCamera();
                        setUploadMode("file");
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <Upload size={14} />
                      <span>Upload File Instead</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Live Video Element */}
              <video
                ref={videoRef}
                className="camera-video-element"
                autoPlay
                playsInline
                muted
                style={{
                  display: isStreaming && !capturedImage && !cameraError ? "block" : "none"
                }}
              />

              {/* Captured Image Preview */}
              {capturedImage && (
                <img
                  src={capturedImage}
                  alt="Captured Document"
                  className="camera-video-element"
                  style={{ objectFit: "contain", backgroundColor: "#000" }}
                />
              )}

              {/* Document Alignment Frame */}
              {isStreaming && !capturedImage && !cameraError && (
                <div className="camera-document-frame" />
              )}
            </div>

            {/* Bottom Controls Bar */}
            {!cameraError && (
              <div className="camera-bottom-controls">
                {!capturedImage ? (
                  /* Capture Button */
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <button
                      type="button"
                      onClick={capturePhoto}
                      disabled={!isStreaming || cameraLoading}
                      className="camera-shutter-btn"
                      title="Capture Photo (ಫೋಟೋ ತೆಗೆಯಿರಿ)"
                    >
                      <div className="camera-shutter-inner">
                        <Camera size={22} />
                      </div>
                    </button>
                    <span style={{ fontSize: 11, color: "#AAA" }}>
                      ದಾಖಲೆಯನ್ನು ಚೌಕಟ್ಟಿನಲ್ಲಿರಿಸಿ ಕ್ಲಿಕ್ ಮಾಡಿ (Capture Document)
                    </span>
                  </div>
                ) : (
                  /* Retake & Use Photo Buttons */
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                    <button
                      type="button"
                      onClick={retakePhoto}
                      className="btn btn-secondary btn-sm"
                      style={{ background: "#332B25", color: "#FFF", borderColor: "#55473E" }}
                    >
                      <RotateCcw size={15} />
                      <span>Retake (ಮತ್ತೆ ತೆಗೆಯಿರಿ)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleUseCapturedPhoto}
                      className="btn btn-primary btn-sm"
                    >
                      <Check size={15} />
                      <span>Use This Photo (ಈ ಫೋಟೋ ಬಳಸಿ OCR ಮಾಡಿ)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* File Upload Dropzone Interface */
          <div
            className={`dropzone ${isDragOver ? "active" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <div className="dropzone-icon">
              <UploadCloud size={28} />
            </div>
            <div className="dropzone-title">
              ದಾಖಲೆಯನ್ನು ಇಲ್ಲಿ ಎಳೆಯಿರಿ ಮತ್ತು ಬಿಡಿ (Drag & Drop)
            </div>
            <div className="dropzone-hint">
              ಅಥವಾ ಕೆಳಗಿನ ಆಯ್ಕೆಗಳನ್ನು ಬಳಸಿ • Support: JPG, PNG, PDF (Max 15MB)
            </div>

            {/* Visible Action Buttons for Upload File & Take Picture */}
            <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrowseClick();
                }}
              >
                <Upload size={16} />
                <span>Upload File (ಬ್ರೌಸ್ ಮಾಡಿ)</span>
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadMode("camera");
                  startCamera();
                }}
              >
                <Camera size={16} />
                <span>Take Picture (ಕ್ಯಾಮೆರಾ)</span>
              </button>
            </div>
          </div>
        )
      ) : (
        /* Uploaded File Preview Card */
        <div className="file-preview-card">
          <div className="file-info">
            <div
              className="feature-icon-box"
              style={{
                width: 44,
                height: 44,
                backgroundColor: "var(--color-primary-soft)",
                color: "var(--color-primary)",
                borderRadius: 10
              }}
            >
              {uploadedFile.type === "application/pdf" ? (
                <FileText size={22} />
              ) : (
                <ImageIcon size={22} />
              )}
            </div>
            <div className="file-details">
              <span className="file-name" title={uploadedFile.name}>
                {uploadedFile.name}
              </span>
              <span className="file-size">
                {uploadedFile.size
                  ? typeof uploadedFile.size === "number"
                    ? `${(uploadedFile.size / 1024).toFixed(1)} KB`
                    : uploadedFile.size
                  : "Ready"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isExtracting ? (
              <span className="badge badge-gold">
                <Sparkles size={12} className="spinning" />
                <span>Extracting OCR...</span>
              </span>
            ) : isTranslating ? (
              <span className="badge badge-gold">
                <Sparkles size={12} className="spinning" />
                <span>Translating...</span>
              </span>
            ) : (
              <span className="badge badge-success">
                <CheckCircle size={13} />
                <span>Uploaded</span>
              </span>
            )}
            <button
              onClick={handleRemoveFile}
              disabled={isExtracting || isTranslating}
              className="btn-icon-only btn-secondary"
              title="Remove file"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Upload Progress Bar */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
            <span>ಕಡತ ಪ್ರಕ್ರಿಯೆಗೊಳ್ಳುತ್ತಿದೆ (Processing)...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      )}

      {/* Image Preview if applicable */}
      {filePreview && (
        <div style={{ marginTop: 16, border: "1px solid var(--color-border)", borderRadius: 12, overflow: "hidden", maxHeight: 220, textAlign: "center", backgroundColor: "#F7F2E8" }}>
          <img
            src={filePreview}
            alt="Uploaded Preview"
            style={{ maxWidth: "100%", maxHeight: 220, objectFit: "contain" }}
          />
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-danger)", fontSize: 13, marginTop: 10 }}>
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quick Sample Document Picker for judges / demo */}
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px dashed var(--color-border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Instant Sample Documents (ಪರೀಕ್ಷಾ ಮಾದರಿಗಳು):
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
          {SAMPLE_DOCUMENTS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => {
                if (processingRef.current) return;
                stopCamera();
                setUploadMode("file");
                loadSampleDocument(sample.id);
              }}
              disabled={isExtracting || isTranslating}
              className="btn btn-secondary btn-sm"
              style={{ textAlign: "left", justifyContent: "flex-start", fontSize: 12, padding: "8px 10px" }}
              title={sample.title}
            >
              <FileCheck size={14} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {sample.title.split("(")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
