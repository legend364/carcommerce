# Libraries
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from typing import Optional
from src.entity.listing import Listing, TransmissionType, FuelType  
from src.entity import db


search_listing_blueprint = Blueprint('search_listing', __name__)
@search_listing_blueprint.route('/api/listing/search_listing', methods=['GET'])

def search_listing(make: Optional[str] = None,
                   model: Optional[str] = None,
                   year: Optional[int] = None,
                   min_price: Optional[float] = None,
                   max_price: Optional[float] = None,
                   min_mileage: Optional[int] = None,
                   max_mileage: Optional[int] = None,
                   transmission: Optional[str] = None,
                   fuel_type: Optional[str] = None,
                   is_sold: Optional[bool] = None) -> list[Listing]:
    """Search listings with optional filters."""
    query = Listing.query

    # Apply filters dynamically
    if make:
        query = query.filter(Listing.make.ilike(f'{make}%')) # Case-insensitive partial search
    if model:
        query = query.filter(Listing.model.ilike(f'{model}%')) # Case-insensitive partial search
    if year:
        query = query.filter_by(year=year)
    if min_price is not None:
        query = query.filter(Listing.price >= min_price)
    if max_price is not None:
        query = query.filter(Listing.price <= max_price)
    if min_mileage is not None:
        query = query.filter(Listing.mileage >= min_mileage)
    if max_mileage is not None:
        query = query.filter(Listing.mileage <= max_mileage)
    if transmission:
        try:
            transmission_enum = TransmissionType(transmission)
            query = query.filter_by(transmission=transmission_enum)
        except ValueError:
            return []  # Invalid transmission value
    if fuel_type:
        try:
            fuel_type_enum = FuelType(fuel_type)
            query = query.filter_by(fuel_type=fuel_type_enum)
        except ValueError:
            return []  # Invalid fuel type value
    if is_sold is not None:
        query = query.filter_by(is_sold=is_sold)

    # Execute and return the filtered listings
    return query.all()
