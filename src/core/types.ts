export type Placement = 'top' | 'right' | 'bottom' | 'left';

export interface GuideStep {
  id: string;
  selector: string;
  title: string;
  description: string;
  placement?: Placement;
  isIntro?: boolean;
}

export interface Guide {
  id: string;
  name: string;
  matches: string[];
  steps: GuideStep[];
}

export interface GuideProgress {
  guideId: string;
  currentStepIndex: number;
  completed: boolean;
}

export type MessageType = 
  | 'START_GUIDE' 
  | 'CONTINUE_GUIDE' 
  | 'STOP_GUIDE' 
  | 'GET_STATUS' 
  | 'CHECK_VUE';

export interface ExtensionMessage {
  type: MessageType;
  payload?: any;
}
