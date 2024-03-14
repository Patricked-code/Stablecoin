import PropTypes from "prop-types";
import React from 'react'

const SEO = ({ title, description,keywords }) => {
    return (
        <>
            <meta charSet="utf-8" />
            <title>{title ? `${title} || Stablecoin de Wealthtech Innovations` : "Stablecoin de Wealthtech Innovations"}</title>
            <meta name="robots" content="noindex, follow" />
            <meta name="description" content={description || "Stablecoin est une plateforme qui contient un actif numérique fiable adossé au franc CFA - XOF/XAF pour vos transactions."} />
            <meta name="keywords" content={keywords || "Stablecoin, Monnaie numérique, Actif numérique, Blockchain, Solidity"} />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        </>
    )
}

SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string, // Ajout de la propType pour description
    keywords:PropTypes.string
};

export default SEO;
