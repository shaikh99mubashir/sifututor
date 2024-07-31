// import React from 'react';
import {
    ScrollView,
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Modal,
    ToastAndroid,
    Alert,
    PermissionsAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Theme } from '../../constant/theme';

interface ModalImgProps {
    modalVisible: boolean;
    openGallery: () => Promise<void>;
    openCamera: () => Promise<void>;
    closeModal: () => void;
    uploadPdf?: () => Promise<void>; // Optional, as not all usages require it
    pdf?: boolean; // Optional, as not all usages require it
}

export default function ModalImg({
    modalVisible,
    openGallery,
    openCamera,
    closeModal,
    uploadPdf,
    pdf
}:ModalImgProps) 
{
    return (
        <Modal transparent={true} visible={modalVisible} animationType="slide">
            <View style={styles.backContainer}>
                <View style={[styles.frontContainer]}>
                    <TouchableOpacity style={[styles.innerContainer, { alignSelf: 'flex-end' }]} onPress={closeModal}>
                        <AntDesign name="closecircleo" size={20} color={'grey'} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', paddingVertical: 20 }}>
                        <TouchableOpacity style={[styles.innerContainer, { alignItems: 'center' }]} onPress={openCamera}>
                            <AntDesign name="camera" size={40} color={'grey'} />
                            <Text style={[styles.textStyle, { marginTop: 20 }]}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.midContainer, { alignItems: 'center' }]} onPress={openGallery}>
                            <AntDesign name="clouduploado" size={40} color={'grey'} />
                            <Text style={[styles.textStyle, { marginTop: 20 }]}>Upload Photo</Text>
                        </TouchableOpacity>
                        {pdf &&
                            <TouchableOpacity style={[styles.midContainer, { alignItems: 'center' }]} onPress={uploadPdf}>
                                <AntDesign name="pdffile1" size={40} color={'grey'} />
                                <Text style={[styles.textStyle, { marginTop: 20 }]}>Upload PDF</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backContainer: {
        backgroundColor: '#000000aa',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    frontContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%',
    },
    innerContainer: {
        padding: 10,
        // paddingHorizontal: 30,
    },
    midContainer: {
        padding: 10,
        // paddingHorizontal: 30,
        borderColor: Theme.gray
    },
    removeContainer: {
        padding: 10,
        paddingHorizontal: 30,
        borderColor: Theme.gray
    },
    textStyle: {
        fontSize: 16,
        color: Theme.darkGray,
        fontFamily: 'Circular Std Medium'
    }
})
