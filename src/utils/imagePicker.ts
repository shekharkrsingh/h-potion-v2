import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export interface ImagePickerResult {
    uri: string;
    type?: string;
    fileName?: string;
}

export const pickImage = async (
    aspectRatio?: [number, number]
): Promise<ImagePickerResult | null> => {
    try {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                throw new Error('Permission to access media library is required');
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: aspectRatio,
            quality: 0.8,
        });

        if (result.canceled) {
            return null;
        }

        const asset = result.assets[0];
        if (!asset) {
            return null;
        }

        const uri = asset.uri;
        const fileName = uri.split('/').pop() || 'image.jpg';
        const type = `image/${fileName.split('.').pop() || 'jpg'}`;

        return {
            uri,
            type,
            fileName,
        };
    } catch (error) {
        throw error;
    }
};
