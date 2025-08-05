exports.searchMovies = async (req, res) => {
    try {
        const { query, page = 1, limit = 10, sort = 'date_desc' } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }

        const regex = new RegExp(query, 'i'); // case-insensitive partial match

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Determine sorting field and order
        let sortOption = {};
        switch (sort) {
            case 'title_asc':
                sortOption = { title: 1 }; // A → Z
                break;
            case 'title_desc':
                sortOption = { title: -1 }; // Z → A
                break;
            case 'date_asc':
                sortOption = { createdAt: 1 }; // Oldest first
                break;
            case 'date_desc':
            default:
                sortOption = { createdAt: -1 }; // Newest first
                break;
        }

        const movies = await Movie.find({
            $or: [
                { title: regex },
                { genre: regex }
            ]
        })
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const totalCount = await Movie.countDocuments({
            $or: [
                { title: regex },
                { genre: regex }
            ]
        });

        res.status(200).json({
            movies,
            totalCount,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / limit)
        });

    } catch (err) {
        console.error('Error in searchMovies:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
