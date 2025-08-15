import { create } from "zustand";


interface CalendarState {
    markedDates: Record<string, any>,
    setMarkedDates: (markedDates: Record<string, any>) => void,
    selectedDate: string | null,
    setSelectedDate: (dateString: string) => void,
    deleteMarkedDate: (dateString: string) => void,
};
        

export const useCalendarStore = create<CalendarState>((set) => {
    return {
        markedDates: {},
        setMarkedDates: (markedDates: Record<string, object>) => set({ markedDates }),
        selectedDate: null,
        setSelectedDate: (dateString: string) => set({ selectedDate: dateString }),
        deleteMarkedDate: (dateString: string) => set((state) => {
            const selected = state.selectedDate;
            if (!selected || !state.markedDates[selected]) { return {}; }

            const newMarkedDates = { ...state.markedDates };
            const dots = newMarkedDates[selected]?.dots.length > 1
                ? newMarkedDates[selected].dots.filter((dot: any) => dot.key !== dateString)
                : [];

            if (dots.length === 0) {
                // Remove the date key entirely if no dots left
                delete newMarkedDates[selected].dots;
            } else {
                newMarkedDates[selected] = {
                    ...newMarkedDates[selected],
                    dots,
                };
            }

            return { markedDates: newMarkedDates };
        }),
    };
});