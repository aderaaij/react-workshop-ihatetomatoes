import React from 'react';
import Card from './Card';
import data from './data/Data';
import GoogleMap from './GoogleMap';
import Header from './Header';
import jump from 'jump.js';
import { easeInOutCubic } from './utils/Easing';

class App extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            properties: data.properties,
            activeProperty: data.properties[0],
            filterIsVisible: false,
            filterBedrooms: 'any',
            filteredProperties: [],
            isFiltering: false,
        }

        this.setActiveProperty = this.setActiveProperty.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.filterProperties = this.filterProperties.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    handleFilterChange(e) {
        const target = e.target;
        const { value, name } = target;
        // console.log(`${value} ${name}`)
        this.setState({
            [name]: value,
        }, function() {
            this.filterProperties();
        });
    }

    filterProperties() {
        const { properties, filterBedrooms } = this.state;
        const isFiltering = filterBedrooms !== 'any';

        const getFilteredProperties = (properties) => {

            const filteredProperties = [];
            properties.map(property => {
                const { bedrooms } = property;
                console.log(parseInt(filterBedrooms));
                const match = bedrooms === parseInt(filterBedrooms) || filterBedrooms === 'any';

                // If the match is true, push to filteredProperties array
                match && filteredProperties.push(property);
            })

            return filteredProperties;

        };

        this.setState({
            filteredProperties: getFilteredProperties(properties),
            isFiltering
        });
    }

    toggleFilter(e)  {
        e.preventDefault();
        this.setState({
            filterIsVisible: !this.state.filterIsVisible,
        });
    }

    setActiveProperty(property, scroll) {
        this.setState({
            activeProperty: property
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

    render(){
        const { properties, activeProperty, filterIsVisible } = this.state;
        return (
            <div>
                {/* listings - Start */}
                <div className="listings">

                    {/* Header - Start - add .filter-is-visible to show filter*/}
                    <Header
                        filterIsVisible={ filterIsVisible }
                        toggleFilter={ this.toggleFilter }
                        handleFilterChange={ this.handleFilterChange }
                    />
                    {/* Header - End */}

                    <div className="cards container">
                        <div className="cards-list row ">
                        {
                            properties.map(property => {
                                return <Card
                                            key={ property._id }
                                            property={ property }
                                            activeProperty={ activeProperty }
                                            setActiveProperty={ this.setActiveProperty }
                                        />
                            })
                        }
                        </div>
                    </div>
                </div>
                {/* listings - End */}

                {/* mapContainer - Start  */}
                <GoogleMap
                    properties={ properties }
                    activeProperty={ activeProperty }
                    setActiveProperty={ this.setActiveProperty }
                />
                {/* mapContainer - End */}
            </div>
        )
    }
}

export default App;