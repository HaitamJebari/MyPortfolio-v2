import React, { useState, useEffect } from "react"
import { Modal, IconButton, Box, Fade, Backdrop, Zoom, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import FullscreenIcon from "@mui/icons-material/Fullscreen"

const Certificate = ({ ImgSertif }) => {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  // Enhanced URL construction with validation and fallbacks
 const getImageUrl = (filename) => {
  if (!filename) return '';
  
  const cleanFilename = filename.trim();
  
  if (cleanFilename.startsWith('http')) {
    return cleanFilename.replace(/([^:]\/)\/+/g, '$1');
  }
  
  const baseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://brkzboljsaylkzvygjnx.supabase.co/storage/v1/object/public';
  const encodedFilename = encodeURIComponent(cleanFilename);
  
  return `${baseUrl}/certificates/${encodedFilename}`;
};

  const imageUrl = getImageUrl(ImgSertif);

  // Enhanced error handling with retry mechanism
  const handleImageError = (event) => {
    console.error('Failed to load image:', imageUrl);
    console.error('Error details:', event);
    
    // Attempt retry for transient network issues
    if (retryCount < 2) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setImgError(false);
        // Force reload by updating the src
        if (event.target) {
          event.target.src = imageUrl + '?retry=' + (retryCount + 1);
        }
      }, 1000);
    } else {
      setImgError(true);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImgError(false);
    setRetryCount(0);
  };

  // Preload image to detect issues early
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImgError(true);
      img.src = imageUrl;
    }
  }, [imageUrl]);

  // Fallback content for failed images
  const renderFallback = () => (
    <Box
      sx={{
        width: "100%",
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        border: "2px dashed #ccc"
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Certificate image unavailable
      </Typography>
    </Box>
  );

  
  return (
    <Box component="div" sx={{ width: "100%" }}>
      {/* Thumbnail Container */}
      <Box
        className=""
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 2,
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: imgError ? "none" : "translateY(-5px)",
            boxShadow: imgError ? "0 8px 16px rgba(0,0,0,0.1)" : "0 12px 24px rgba(0,0,0,0.2)",
            "& .overlay": {
              opacity: imgError ? 0 : 1,
            },
            "& .hover-content": {
              transform: imgError ? "translate(-50%, -60%)" : "translate(-50%, -50%)",
              opacity: imgError ? 0 : 1,
            },
            "& .certificate-image": {
              filter: imgError ? "none" : "contrast(1.05) brightness(1) saturate(1.1)",
            },
          },
        }}>
        
        {/* Certificate Image with Enhanced Error Handling */}
        <Box
          sx={{
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              zIndex: 1,
              display: imgError ? "none" : "block"
            },
          }}>
          
          {imgError ? (
            renderFallback()
          ) : (
            <img
              className="certificate-image"
              src={imageUrl}
              alt="Certificate"
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "cover",
                filter: "contrast(1.10) brightness(0.9) saturate(1.1)",
                transition: "filter 0.3s ease",
                opacity: imageLoaded ? 1 : 0.5,
              }}
              onClick={imageLoaded ? handleOpen : undefined}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          )}
        </Box>

        {/* Hover Overlay - Only show if image loaded successfully */}
        {!imgError && (
          <Box
            className="overlay"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0,
              transition: "all 0.3s ease",
              cursor: imageLoaded ? "pointer" : "default",
              zIndex: 2,
            }}
            onClick={imageLoaded ? handleOpen : undefined}>
            
            {/* Hover Content */}
            <Box
              className="hover-content"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -60%)",
                opacity: 0,
                transition: "all 0.4s ease",
                textAlign: "center",
                width: "100%",
                color: "white",
              }}>
              <FullscreenIcon
                sx={{
                  fontSize: 40,
                  mb: 1,
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}>
                View Certificate
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Modal - Only render if image loaded successfully */}
      {!imgError && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 300,
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              backdropFilter: "blur(5px)",
            },
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: 0,
            padding: 0,
            "& .MuiBackdrop-root": {
              backgroundColor: "rgba(0, 0, 0, 0.9)",
            },
          }}>
          <Box
            sx={{
              position: "relative",
              width: "auto",
              maxWidth: "90vw",
              maxHeight: "90vh",
              m: 0,
              p: 0,
              outline: "none",
              "&:focus": {
                outline: "none",
              },
            }}>
            
            {/* Close Button */}
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
                color: "white",
                bgcolor: "rgba(0,0,0,0.6)",
                zIndex: 1,
                padding: 1,
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.8)",
                  transform: "scale(1.1)",
                },
              }}
              size="large">
              <CloseIcon sx={{ fontSize: 24 }} />
            </IconButton>

            {/* Modal Image */}
            <img
              src={imageUrl}
              onError={handleImageError}
              alt="Certificate Full View"
              style={{
                display: "block",
                maxWidth: "100%",
                maxHeight: "90vh",
                margin: "0 auto",
                objectFit: "contain",
              }}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          </Box>
        </Modal>
      )}
    </Box>
  )
}

export default Certificate