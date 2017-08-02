import React from 'react';
import jump from 'jump.js';
import Card from './Card';
import data from './data/Data';
import GoogleMap from './GoogleMap';
import Header from './Header';
import { easeInOutCubic } from './utils/Easing';
import image from '../images/location-map.svg';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            properties: data.properties,
            activeProperty: data.properties[0],
            filterIsVisible: false,
            filterBedrooms: 'any',
            filterBathrooms: 'any',
            filterCars: 'any',
            filterSort: 'any',
            filteredProperties: [],
            priceFrom: '500000',
            priceTo: '1000000',
            isFiltering: false,
        };

        this.setActiveProperty = this.setActiveProperty.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.clearFilter = this.clearFilter.bind(this);
        this.filterProperties = this.filterProperties.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    handleFilterChange(e) {
        const target = e.target;
        const { value, name } = target;
        // console.log(`${value} ${name}`)
        this.setState({
            [name]: value,
        }, function () {
            this.filterProperties();
        });
    }

    filterProperties() {
        const {
            properties,
            filterBedrooms,
            filterBathrooms,
            filterCars,
            filterSort,
            priceFrom,
            priceTo,
        } = this.state;
        const isFiltering =
            filterBedrooms !== 'any' ||
            filterBathrooms !== 'any' ||
            filterCars !== 'any' ||
            filterSort !== 'any' ||
            priceFrom !== '0' ||
            priceTo !== '1000001';

        const getFilteredProperties = (properties) => {
            const filteredProperties = [];

            properties.map((property) => {
                const { bedrooms, bathrooms, carSpaces, price } = property;
                const match =
                    (bedrooms === parseInt(filterBedrooms) || filterBedrooms === 'any') &&
                    (bathrooms === parseInt(filterBathrooms) || filterBathrooms === 'any') &&
                    (carSpaces === parseInt(filterCars) || filterCars === 'any') &&
                    (price >= priceFrom && price <= priceTo);


                // If the match is true, push to filteredProperties array
                match && filteredProperties.push(property);
            });

            switch (filterSort) {
            case '0':
                console.log('test');
                filteredProperties.sort((a, b) => a.price - b.price);
                break;
            case '1':
                console.log('test2');
                filteredProperties.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
            }
            return filteredProperties;
        };

        this.setState({
            filteredProperties: getFilteredProperties(properties),
            activeProperty: getFilteredProperties(properties)[0] || properties[0],
            isFiltering,
        });
    }

    toggleFilter(e) {
        e.preventDefault();
        this.setState({
            filterIsVisible: !this.state.filterIsVisible,
        });
    }

    clearFilter(e, form) {
        e.preventDefault();
        this.setState({
            properties: this.state.properties.sort((a, b) => a.index - b.index),
            filterBedrooms: 'any',
            filterBathrooms: 'any',
            filterCars: 'any',
            filterSort: 'any',
            filteredProperties: [],
            isFiltering: false,
            priceFrom: '500000',
            priceTo: '1000000',
            activeProperty: this.state.properties[0],
        });
        form.reset();
    }

    setActiveProperty(property, scroll) {
        this.setState({
            activeProperty: property,
        });

        const { index } = property;

        // Scroll to active property
        if (scroll) {
            const target = `#card-${index}`;
            jump(target, {
                duration: 800,
                easing: easeInOutCubic,
            });
        }
    }

    render() {
        const {
            properties,
            activeProperty,
            filterIsVisible,
            filteredProperties,
            isFiltering,
        } = this.state;
        const propertiesList = isFiltering ? filteredProperties : properties;

        return (
            <div>
                <div className="listings">
                    <Header
                        filterIsVisible={ filterIsVisible }
                        toggleFilter={ this.toggleFilter }
                        handleFilterChange={ this.handleFilterChange }
                        clearFilter={ this.clearFilter }
                    />

                    <div className="cards container">
                        <div className={ `cards-list row ${propertiesList.length === 0 ? 'is-empty' : ''}`}>
                        {
                            propertiesList.map(property => <Card
                                            key={ property._id }
                                            property={ property }
                                            activeProperty={ activeProperty }
                                            setActiveProperty={ this.setActiveProperty }
                                        />)
                        }
                        {
                            (isFiltering && propertiesList.length === 0) && <p className="warning"><img src={ image } alt=""/><br/>No properties were found</p>
                        }
                        </div>
                    </div>
                </div>
                <GoogleMap
                    properties={ properties }
                    activeProperty={ activeProperty }
                    setActiveProperty={ this.setActiveProperty }
                    filteredProperties={ filteredProperties }
                    isFiltering={ isFiltering }
                />
            </div>
        );
    }
}

export default App;
