import express from "express";
import upload from "../middleware/multer.js";
import { validateServicePackage } from "../middleware/validateServicepackages.js";
import {
    getAllServicePackages,
    getServicePackageById,
    addServicePackage,
    updateServicePackage,
    deleteServicePackage
} from "../controllers/packageController.js"; 

const servicePackageRouter = express.Router();


servicePackageRouter.get("/get-all-service-packages", getAllServicePackages);
servicePackageRouter.get("/view-service-package/:id", getServicePackageById);
servicePackageRouter.post(
    "/add-service-package",
    upload.single("image"),
    validateServicePackage,
    addServicePackage
);
servicePackageRouter.patch(
    "/update-service-package/:id",
    upload.single("image"),
    validateServicePackage,
    updateServicePackage
);
servicePackageRouter.delete("/delete-service-package/:id", deleteServicePackage);

export default servicePackageRouter;
