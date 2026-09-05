const mongoose = require("mongoose");

const certificateSettingsSchema = new mongoose.Schema(
	{
		settingKey: { type: String, default: "global", unique: true },
		certificateTitle: { type: String, default: "Certificate of Completion", trim: true },
		organizationName: { type: String, default: "Skill.AI Training", trim: true },
		subtitle: { type: String, default: "This is to certify that", trim: true },
		signatureName: { type: String, default: "Authorized Signature", trim: true },
		signatureDesignation: { type: String, default: "Course Director", trim: true },
		logoUrl: { type: String, default: "", trim: true },
		signatureImageUrl: { type: String, default: "", trim: true },
		templateName: { type: String, default: "Classic", trim: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("CertificateSettings", certificateSettingsSchema);
