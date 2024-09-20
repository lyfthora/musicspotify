import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faChartBar, faShoppingCart, faBook } from '@fortawesome/free-solid-svg-icons';

const Pages = () => {
    return (
        <div className="pages">
            <nav>
                <ul>
                    <li><FontAwesomeIcon icon={faHome} /> Home</li>
                    <li><FontAwesomeIcon icon={faSearch} /> Search</li>
                    <li><FontAwesomeIcon icon={faChartBar} /> Statistics</li>
                    <li><FontAwesomeIcon icon={faShoppingCart} /> Marketplace</li>
                    <li><FontAwesomeIcon icon={faBook} /> Your Library</li>
                </ul>
            </nav>
        </div>
    );
};

export default Pages;