import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth } from '../firebase';

export default function SplashScreen() {
    const navigation = useNavigation();
    const user = auth.currentUser;

    const isAuthenticated = () => {
        if(user) {
            return true;
        }
        else {
            return false;
        }
    }

    useEffect(() => {
        if(isAuthenticated()) {
            navigation.navigate("Root");
        }
        else {
            navigation.navigate("SignIn");
        }
    })

    return (
        <View>
            <ActivityIndicator/>
        </View>
    )
}