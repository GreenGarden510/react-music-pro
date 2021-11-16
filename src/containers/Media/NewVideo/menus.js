import { genres } from '$common/utils';

export const menus = [{
        name: 'title',
        type: 'text',
        placeholder: 'enter_title',
        title: 'title',
    },
    {
        name: 'director',
        type: 'text',
        placeholder: 'enter_director',
        title: 'director',
    },
    {
        name: 'starring',
        type: 'text',
        placeholder: 'enter_cast_names',
        title: 'starring',
    },
    {
        name: 'genre',
        type: 'select',
        placeholder: 'enter_genre',
        title: 'genre',
        options: genres,
        isMulti: true,
    },
    {
        name: 'productionCompany',
        type: 'text',
        placeholder: 'enter_production_company',
        title: 'production_company',
    },
    {
        name: 'startingDate',
        type: 'date',
        placeholder: 'starting_date',
        title: 'starting_date',
    },
];

export const descriptionMenu = {
    name: 'description',
    type: 'area',
    placeholder: 'enter_description',
    title: 'description'
};