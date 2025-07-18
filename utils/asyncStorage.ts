import AsyncStorage from "@react-native-async-storage/async-storage";
import { useOptionsStore } from "./zustand_stores/optionsStore";

export const hydrateStoreFromAsyncStorage = async () => {
    try {
        const userName = await AsyncStorage.getItem("userName");
        useOptionsStore.getState().setUserName(userName || "");
    } catch (e) {
        console.error("Error hydrating store from async storage:", e);
    }
};
