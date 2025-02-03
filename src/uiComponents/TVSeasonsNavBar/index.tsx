import { ReactNode } from 'react';

import './styles.scss';
import { Dot } from 'lucide-react';
import IconWithText from '../base/IconWIthText';

type TvSeasonsNavBarPropType = {
    header?: string;
    seasons?: {
        id: number,
        component: ReactNode,
    }[];
    breadCrumbElem?: ReactNode;
    children?: ReactNode;
    fullWidth?: boolean;
    activeItemId?: number | string;
}

interface TvSeasonsNavBarListItemProps {
    className?: string;
    children: ReactNode;
    isActive?: boolean;
  }


export function TvSeasonsNavBarListItem(props: TvSeasonsNavBarListItemProps) {
    const { className = '', children, isActive } = props;
    return (
        <li className={`TVSeasonsNavBarList-item ${isActive ? 'TVSeasonsNavBarList-item-active' : ''} ${className}`}>
            <IconWithText>
                {isActive && <Dot className='TVSeasonsNavBarList-item-active-icon' />}
                {children}
            </IconWithText>
        </li>
    );

}

export function TvSeasonsNavBar(props: TvSeasonsNavBarPropType) {
    const { header, breadCrumbElem, fullWidth } = props;

    return (
        <div className={`TVSeasonsNavBar${fullWidth? ' fullWidth':''}`}>
            <ul className="TVSeasonsNavBarList">
                {
                    !!breadCrumbElem &&
                    <li>
                        {breadCrumbElem}
                    </li>
                }

                {
                    !!header &&
                    <li>
                        <div className="TVSeasonsNavBar-title TVSeasonsNavBar-title-header">{header}</div>
                    </li>
                }

                {!!props.children && props.children}
            </ul>
        </div>
    );
}



export default TvSeasonsNavBar;
