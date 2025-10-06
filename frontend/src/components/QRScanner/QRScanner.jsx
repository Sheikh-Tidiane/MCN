import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, X, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { oeuvreService } from '../../services/oeuvreService';
import { useLanguage } from '../../hooks/useLanguage';

const QRScanner = ({ onClose, onScanSuccess }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    if (isScanning) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isScanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        scanForQR();
      }
    } catch (err) {
      setError('Accès à la caméra refusé. Veuillez autoriser l\'accès à la caméra.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const scanForQR = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          handleQRCodeFound(code.data);
        } else if (isScanning) {
          requestAnimationFrame(scan);
        }
      } else if (isScanning) {
        requestAnimationFrame(scan);
      }
    };

    scan();
  };

  const handleQRCodeFound = async (qrData) => {
    setIsScanning(false);
    setSuccess(true);
    setScannedData(qrData);

    try {
      // Appel API pour récupérer les détails de l'œuvre
      const response = await oeuvreService.scanQrCode(qrData, currentLanguage);
      
      if (response.data) {
        setSuccess(true);
        setTimeout(() => {
          if (onScanSuccess) {
            onScanSuccess(response.data);
          } else {
            navigate(`/oeuvre/${response.data.id}`);
          }
        }, 1500);
      }
    } catch (err) {
      setError('Œuvre non trouvée. Veuillez scanner un QR code valide.');
      setTimeout(() => {
        setError(null);
        setIsScanning(true);
      }, 2000);
    }
  };

  const startScan = () => {
    setError(null);
    setSuccess(false);
    setScannedData(null);
    setIsScanning(true);
  };

  const stopScan = () => {
    setIsScanning(false);
    stopCamera();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <QrCode className="text-museum-primary" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">
              Scanner QR Code
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scanner Content */}
        <div className="p-4">
          {!isScanning && !success && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-museum-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="text-museum-primary" size={40} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Scanner une œuvre
              </h3>
              <p className="text-gray-600 mb-6">
                Pointez votre caméra vers le QR code situé près de l'œuvre pour accéder 
                à ses informations détaillées.
              </p>
              <button
                onClick={startScan}
                className="bg-museum-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-museum-secondary transition-colors flex items-center space-x-2 mx-auto"
              >
                <Camera size={20} />
                <span>Commencer le scan</span>
              </button>
            </motion.div>
          )}

          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg flex items-center justify-center">
                    <QrCode className="text-white opacity-50" size={40} />
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Pointez la caméra vers le QR code
                </p>
                <button
                  onClick={stopScan}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Arrêter le scan
                </button>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-green-600" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Œuvre trouvée !
                </h3>
                <p className="text-gray-600">
                  Redirection vers les détails de l'œuvre...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="text-red-600" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Erreur
                </h3>
                <p className="text-gray-600 mb-4">
                  {error}
                </p>
                <button
                  onClick={() => {
                    setError(null);
                    startScan();
                  }}
                  className="bg-museum-primary text-white px-4 py-2 rounded-lg hover:bg-museum-secondary transition-colors"
                >
                  Réessayer
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hidden canvas for QR detection */}
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </div>
  );
};

export default QRScanner;
