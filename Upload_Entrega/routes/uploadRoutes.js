import { Router } from "express";
import {
  upload,
  uploadFile,
  listFiles,
  deleteFile,
  listRecycledFiles,
  restoreFile,
  emptyRecycleBin,
  getSpaceUsage,
  deleteFromRecycle
} from "../controllers/uploadController.js";
import { subscribeEmail } from '../services/emailService.js';

const router = Router();


router.get("/recycle", listRecycledFiles);
router.delete("/empty-recycle", emptyRecycleBin); 
router.delete("/recycle/:fileName", deleteFromRecycle);
router.post("/restore/:fileName", restoreFile);

router.get("/space-usage", getSpaceUsage);
router.post("/", upload.single("file"), uploadFile);
router.get("/", listFiles);
router.delete("/:fileName", deleteFile);


router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico es requerido'
      });
    }

    await subscribeEmail(email);
    
    res.json({
      success: true,
      message: 'Suscripción exitosa. Se ha enviado un reporte inicial a tu correo.'
    });
  } catch (error) {
    console.error('Error en suscripción:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
