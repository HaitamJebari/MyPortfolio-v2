import React, { useState } from "react"
import { Modal, IconButton, Box, Backdrop, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import FullscreenIcon from "@mui/icons-material/Fullscreen"

const Certificate = ({ ImgSertif }) => {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  
  const getImageUrl = (filename) => {
    if (!filename) return '';
      // Fix malformed 'https:/example.com' → 'https://example.com'
  if (filename.startsWith('http')) {
    return filename.replace(/^https?:\/(?!\/)/, match => match + '/');
  }
    // Construct full Supabase URL
  const encoded = encodeURIComponent(filename);
  return `https://brkzboljsaylkzvygjnx.supabase.co/storage/v1/object/public/certificates/${encoded}`;

  };

  const imageUrl = getImageUrl(ImgSertif);
  console.log("✅ Final image URL:", imageUrl);

  const handleImageError = () => {
    console.error('❌ Failed to load image:', imageUrl);
    setImgError(true);
  };



  return (
    <Box component="div" sx={{ width: "100%" }}>
      {/* Certificate Display */}
      <Box sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
          "& .overlay": { opacity: 1 },
          "& .hover-content": {
            transform: "translate(-50%, -50%)",
            opacity: 1
          },
          "& .certificate-image": {
            filter: "contrast(1.05) brightness(1) saturate(1.1)"
          }
        }
      }}>
        <Box sx={{
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            zIndex: 1
          }
        }}>
          <img
            className="certificate-image"
            src={imageUrl}
            alt="Certificate"
            onError={handleImageError}
            onClick={handleOpen}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "cover",
              filter: "contrast(1.10) brightness(0.9) saturate(1.1)",
              transition: "filter 0.3s ease"
            }}
          />
        </Box>

        {/* Overlay */}
        <Box
          className="overlay"
          sx={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            opacity: 0,
            transition: "all 0.3s ease",
            cursor: "pointer",
            zIndex: 2
          }}
          onClick={handleOpen}>
          <Box
            className="hover-content"
            sx={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -60%)",
              opacity: 0,
              transition: "all 0.4s ease",
              textAlign: "center",
              width: "100%",
              color: "white"
            }}>
            <FullscreenIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              View Certificate
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(5px)"
          }
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
        <Box sx={{
          position: "relative",
          width: "auto",
          maxWidth: "90vw",
          maxHeight: "90vh"
        }}>
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
                transform: "scale(1.1)"
              }
            }}>
            <CloseIcon sx={{ fontSize: 24 }} />
          </IconButton>

          <img
            src={imageUrl}
            onError={handleImageError}
            alt="Certificate Full View"
            style={{
              display: "block",
              maxWidth: "100%",
              maxHeight: "90vh",
              margin: "0 auto",
              objectFit: "contain"
            }}
          />
        </Box>
      </Modal>
    </Box>
  )
}

export default Certificate;
