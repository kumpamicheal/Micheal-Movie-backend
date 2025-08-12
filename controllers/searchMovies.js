exports.searchMovies = async (req, res) => {
    try {
        // Support both "query" and "title" params
        const searchTerm = req.query.query || req.query.title;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort || 'date_desc';

        if (!searchTerm) {
            return res.status(400).json({ message: 'Search term is required' });
        }

        const regex = new RegExp(searchTerm, 'i');
        const skip = (page - 1) * limit;

        let sortOption = {};
        switch (sort) {
            case 'title_asc': sortOption = { title: 1 }; break;
            case 'title_desc': sortOption = { title: -1 }; break;
            case 'date_asc': sortOption = { createdAt: 1 }; break;
            case 'date_desc':
            default: sortOption = { createdAt: -1 }; break;
        }

        const filter = { $or: [{ title: regex }, { genre: regex }] };

        const movies = await Movie.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        const totalCount = await Movie.countDocuments(filter);

        res.status(200).json({
            movies,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit)
        });

    } catch (err) {
        console.error('Error in searchMovies:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
