import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';

const Splash = ({ onFinish }: { onFinish: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 5000);

        return () => clearTimeout(timer);
}, [onFinish]);

    return (
        <View style={styles.container}> 
            <Image
                source={require('../assets/images/main_logo.png')}
                style={styles.logo}
                resizeMode='contain'
            />
        </View>
    );
};

export default Splash;

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    logo: {
        width: '50%',
        height: undefined,
        aspectRatio: 1,
    }
});