/**
 * Image Analysis Service
 * Handles crop disease detection and plant health analysis
 */

export interface ImageAnalysisRequest {
    imageUrl: string;
    language: 'darija' | 'french' | 'arabic';
    analysisType?: 'disease' | 'pest' | 'nutrient' | 'general';
}

export interface DiseaseDetection {
    diseaseName: string;
    confidence: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    affectedArea: number; // percentage
}

export interface TreatmentRecommendation {
    method: string;
    products?: string[];
    steps: string[];
    preventiveMeasures: string[];
    estimatedCost?: string;
}

export interface ImageAnalysisResponse {
    success: boolean;
    detections: DiseaseDetection[];
    diagnosis: string;
    treatment: TreatmentRecommendation;
    additionalNotes?: string;
    imageMetadata?: {
        width: number;
        height: number;
        format: string;
    };
}

/**
 * Analyze an image for crop diseases and problems
 */
export async function analyzeImage(request: ImageAnalysisRequest): Promise<ImageAnalysisResponse> {
    try {
        // TODO: Replace with actual API endpoint
        const response = await fetch('/api/image/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`Image analysis API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error analyzing image:', error);
        throw error;
    }
}

/**
 * Upload an image file and get analysis
 */
export async function uploadAndAnalyzeImage(
    file: File,
    language: 'darija' | 'french' | 'arabic'
): Promise<ImageAnalysisResponse> {
    try {
        // First, upload the image
        const formData = new FormData();
        formData.append('image', file);
        formData.append('language', language);

        const uploadResponse = await fetch('/api/image/upload', {
            method: 'POST',
            body: formData,
        });

        if (!uploadResponse.ok) {
            throw new Error(`Image upload error: ${uploadResponse.statusText}`);
        }

        const { imageUrl } = await uploadResponse.json();

        // Then, analyze the uploaded image
        return await analyzeImage({
            imageUrl,
            language,
            analysisType: 'general',
        });
    } catch (error) {
        console.error('Error uploading and analyzing image:', error);
        throw error;
    }
}

/**
 * Convert base64 image to analysis
 */
export async function analyzeBase64Image(
    base64Image: string,
    language: 'darija' | 'french' | 'arabic'
): Promise<ImageAnalysisResponse> {
    try {
        const response = await fetch('/api/image/analyze-base64', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: base64Image,
                language,
            }),
        });

        if (!response.ok) {
            throw new Error(`Image analysis error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error analyzing base64 image:', error);
        throw error;
    }
}
