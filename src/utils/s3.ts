import { S3Client, PutObjectCommand, DeleteObjectCommand ,ListObjectVersionsCommand} from "@aws-sdk/client-s3";
import fs from "fs";
import { HttpException } from "@/exceptions/HttpException";
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_S3_BUCKET_NAME, AWS_SECRET_ACCESS_KEY } from "@/config";
import { logger } from "./logger";


const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECRET_ACCESS_KEY!
    }
});


export const uploadFileToS3 = async (filePath: string, fileName: string, mimeType: string): Promise<string> => {
    try {
        const fileStream = fs.createReadStream(filePath);

        const uploadParams = {
            Bucket: AWS_S3_BUCKET_NAME!,
            Key: `leaves/${fileName}`,
            Body: fileStream,
            ContentType: mimeType  
        };

        const uploadCommand = new PutObjectCommand(uploadParams);
        await s3.send(uploadCommand);
        fs.unlinkSync(filePath);
        
        return `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/uploads/${fileName}`;
    } catch (error) {
        throw new HttpException(500, "Error uploading file to S3");
    }
};


export const deleteFileFromS3 = async (fileName: string): Promise<void> => {
    try {
        const bucketName = process.env.AWS_S3_BUCKET_NAME!;
        const objectKey = `${fileName}`;

        const { Versions } = await s3.send(new ListObjectVersionsCommand({ Bucket: bucketName, Prefix: objectKey }));

        if (!Versions || Versions.length === 0) {
            logger.info("No versions found, skipping deletion.");
            return;
        }

        for (const version of Versions) {
            const deleteParams = {
                Bucket: bucketName,
                Key: objectKey,
                VersionId: version.VersionId,
            };
            await s3.send(new DeleteObjectCommand(deleteParams));
        }

        logger.info(`Deleted all versions of ${fileName}`);
    } catch (error) {
        console.error("Error deleting file from S3:", error);
    }
};
