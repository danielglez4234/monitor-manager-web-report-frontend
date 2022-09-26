const { REACT_APP_APLY_CONSTRAINTS } = process.env
export const CONSTRAINTS = {
    apply_constraints: REACT_APP_APLY_CONSTRAINTS,
    boxplot:{
        only_one_collapse_enabled: true,
        intervals:{
            only_one_type: false
        }
    }
}