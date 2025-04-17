// reducers/parameter.reducer.ts

import { ModelParameters } from "@/types/parameters";

// 1. 定義 State
export interface ParameterState {
  parameterMap: Record<string, ModelParameters>;
}

// 2. 初始 State
export const initialParameterState: ParameterState = {
  parameterMap: {},
};

// 3. 定義 Action
export type ParameterAction =
  | {
      type: "SET_PARAMETERS";
      key: string;
      parameters: ModelParameters;
    }
  | {
      type: "ADD_PARAMETERS";
      key: string;
      parameters: ModelParameters;
    };

// 4. Reducer 主體
export function parameterReducer(
  state: ParameterState,
  action: ParameterAction
): ParameterState {
  switch (action.type) {
    case "SET_PARAMETERS":
    case "ADD_PARAMETERS":
      return {
        ...state,
        parameterMap: {
          ...state.parameterMap,
          [action.key]: action.parameters,
        },
      };
    default:
      return state;
  }
}
