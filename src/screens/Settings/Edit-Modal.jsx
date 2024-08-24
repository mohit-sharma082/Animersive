import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import APP_CONFIG from '../../../app.json';
import MyButton from '../../components/UI/MyButton';


const EditProfileModal = ({ visible, onClose, user, onSave }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);

    const handleSave = () => {
        onSave({ name, email, phone });
        onClose();
    };

    return (
        <Modal
            animationType="fade"
            statusBarTranslucent={true}
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <ImageBackground
                source={require('../../assets/mesh-3.png')}
                style={styles.backgroundImage}
            >

                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Guest"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor={'#fffff80'}
                        />
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. guest@gmail.com"
                            value={email}
                            onChangeText={(text) => { setEmail(text?.toLowerCase()?.trim()) }}
                            placeholderTextColor={'#fffff80'}
                        />

                        <Text style={styles.label}>Phone No. <Text style={{ fontStyle: 'italic', fontSize: 10 }}>(Optional)</Text>
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="eg. 1234567890"
                            value={phone}
                            onChangeText={setPhone}
                            placeholderTextColor={'#fffff80'}
                            keyboardType='number-pad'
                        />
                        <View style={styles.buttonContainer}>
                            <MyButton onPress={onClose} title={'Cancel'} secondary={true}
                                style={{
                                    paddingHorizontal: 14,
                                    backgroundColor: 'transparent'
                                }} />
                            <MyButton onPress={handleSave} title={'Save'}
                                style={{
                                    paddingVertical: 6,
                                    paddingHorizontal: 16,
                                    borderColor: 'transparent',

                                }}
                                textStyles={{
                                    color: 'white',
                                    letterSpacing: 0.8
                                }} />
                        </View>
                    </View>
                </View>

            </ImageBackground>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: APP_CONFIG.backgroundColor + '80',
    },
    modalView: {
        width: '80%',
        backgroundColor: APP_CONFIG.backgroundColor + '50',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: APP_CONFIG.primaryColor
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingVertical: 10,
        marginBottom: 10,
        width: '100%',
        borderBottomColor: APP_CONFIG.backgroundColor + '10',
        borderBottomWidth: 2,
        borderStyle: 'dashed',
        textAlign: 'center'
    },
    label: {
        width: '98%',
        fontSize: 16,
        fontWeight: '500',
        marginTop: 8,
        color: APP_CONFIG.primaryColor,
        // borderLeftColor: APP_CONFIG.primaryColor,
        // borderLeftWidth: 3,
        // padding: 2,
        // paddingLeft: 8,
    },
    input: {
        width: '100%',
        borderBottomWidth: 1,
        borderColor: APP_CONFIG.primaryColor,
        marginBottom: 20,
        padding: 6,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        backgroundColor: '#007BFF',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default EditProfileModal;
