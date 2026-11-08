import { TabType, SubScreen } from './index';

export interface TourStep {
  id: string;
  tab: TabType;
  subScreen?: SubScreen;
  selector: string;
  badge: {
    fr: string;
    en: string;
  };
  title: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  details?: {
    fr: string;
    en: string;
  };
  icon: string;
  placement?: 'top' | 'bottom' | 'center';
  durationMs?: number;
}
