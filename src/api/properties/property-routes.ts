import { Router } from 'express';
import { PropertyController } from './property-controller';
import { Auth } from '../../utilities/auth';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all properties (public)
router.get('/', PropertyController.getAllProperties);

// Search properties (public)
router.get('/search', PropertyController.searchProperties);

// Get property by ID (public)
router.get('/:id', PropertyController.getPropertyById);

// Create property (protected)
router.post('/', Auth.verifyUser, upload.array('photos', 10), PropertyController.createProperty);

// Update property (protected)
router.put('/:id', Auth.verifyUser, PropertyController.updateProperty);

// Delete property (protected)
router.delete('/:id', Auth.verifyUser, PropertyController.deleteProperty);

// Update property photos (protected)
router.put('/:id/photos', Auth.verifyUser, upload.array('photos', 10), PropertyController.updatePropertyPhotos);

export default router; 