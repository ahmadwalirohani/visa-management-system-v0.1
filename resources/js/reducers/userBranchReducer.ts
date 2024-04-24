const initialState: Array<{
    id: number;
    branch_id: number;
}> = [];

const useBranchReducer = (
    state = initialState,
    action: {
        type: string;
        payload: any;
    },
): void => {
    switch (action.type) {
        case "Update":
            action.payload;
            break;
        default:
            state;
    }
};

export default useBranchReducer;
