const config = {
    options: {
        pagination: {
            status: 'enabled',
            paginate: true,
            itemsPerPage: 25,
        },
        ordering: {
            status: 'enabled',
        },
        relations: {
            status: 'enabled',
        },
        select: {
            status: 'enabled',
        },
    },
    policy: 'skip',
};

module.exports = config;
