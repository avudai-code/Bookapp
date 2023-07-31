const Book = require('../models/BookModel');
const apiResponse = require('../helpers/apiResponse');
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
var mongoose = require('mongoose');
const PAGE_SIZE = 10;

function BookData(data) {
	
	this.createdAt = data.createdAt;
}



exports.bookStore = [
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim().custom((value) => {
            return Book.findOne({ title: value }).then(book => {
                if (book) {
                     return Promise.reject('Title already exists.');
                }
            });
         }),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim().custom((value) => {
            return Book.findOne({ author: value }).then(book => {
                if (book) {
                     return Promise.reject('Author already exists.');
                }
            });
         }),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			var book = new Book(
				{
					title: req.body.title,
					author: req.body.author,
					description: req.body.description,
					publicationYear: req.body.year
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
			}
			else {
				//Save Book.
				book.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let bookData = new BookData(book);
					return apiResponse.successResponseWithData(res,'New Book add Successfully.', bookData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];




// GET API for fetching books with pagination (limit and offset)

exports.bookList = [
	function (req, res) {
	  try {
		const limit = Number(req.query.limit) || PAGE_SIZE;
		const page = req.query.page || 1;
		const title = req.query.title;
		const author = req.query.author;
		const sortBy = req.query.sortBy;
  
		const pipeline = [];
		if (title) {
		  pipeline.push({
			$match: {
			  title: { $regex: title, $options: 'i' },
			},
		  });
		}
		if (author) {
		  pipeline.push({
			$match: {
			  author: { $regex: author, $options: 'i' },
			},
		  });
		}
		if (sortBy) {
		  let field = sortBy;
		  let operator = 1;
		  if (sortBy.includes('-')) {
			field = sortBy.split('-')[1];
			operator = -1;
		  }
		  pipeline.push({
			$sort: { [field]: operator },
		  });
		}
  
		// Pagination with facet
		pipeline.push({
		  $facet: {
			metadata: [{ $count: 'total' }, { $addFields: { page: page } }],
			data: [{ $skip: (limit * (page - 1)) }, { $limit: limit }],
		  },
		});
  
		Book.aggregate(pipeline, function (err, result) {
		  if (err) {
			return apiResponse.ErrorResponse(res, err);
		  }
		  res.setHeader('X-Per-Page', limit);
		  res.setHeader('X-Page', page);
		  if (result[0].data.length > 0) {
			res.setHeader('X-Total-Count', result[0].metadata[0].total);
		  } else {
			res.setHeader('X-Total-Count', 0);
		  }
		  return apiResponse.successResponseWithData(res, 'Operation success', result[0].data);
		});
	  } catch (err) {
		// Throw error in JSON response with status 500.
		return apiResponse.ErrorResponse(res, err);
	  }
	},
  ];


exports.bookDetails = [
	function (req, res) {
	  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid Identifier');
	  }
	  try {
		Book.findOne({ _id: req.params.id })
		  .then((book) => {
			if (!book) {
			  return apiResponse.notFoundResponse(res, 'Book not found');
			}
			// Modify book data here if needed
			return apiResponse.successResponseWithData(res, 'Operation success', book);
		  })
		  .catch((err) => {
			return apiResponse.ErrorResponse(res, err);
		  });
	  } catch (err) {
		// Throw error in JSON response with status 500.
		return apiResponse.ErrorResponse(res, err);
	  }
	},
  ];


exports.bookUpdate = [
  body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
  
  (req, res) => {
    try {
      const updates = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
      } else {
        const update = function () {
          let _model = {
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            publicationYear: req.body.year,
            _id: req.params.id,
          };

          const book = new Book(_model);
          Book.findByIdAndUpdate(req.params.id, book, {}, function (err) {
            if (err) {
              return apiResponse.ErrorResponse(res, err);
            }
            // Optional: Modify book data here if needed
            const bookData = new BookData(book);
            return apiResponse.successResponseWithData(res, 'Book update Success.', bookData);
          });
        };

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid Identifier');
        } else {
          Book.findById(req.params.id, async function (err, foundBook) {
            if (foundBook === null) {
              return apiResponse.notFoundResponse(res, 'Book not exist with this id');
            } else {
              
              update();
            }
          });
        }
      }
    } catch (err) {
      // Throw error in JSON response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];



// DELETE API for deleting a book by ID
exports.bookDelete = [
	
	(req, res) => {
	  try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		  return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid Identifier');
		} else {
		  Book.findByIdAndRemove(req.params.id, function (err, deletedBook) {
			if (err) {
			  return apiResponse.ErrorResponse(res, err);
			}
			if (!deletedBook) {
			  return apiResponse.notFoundResponse(res, 'Book not exist with this id');
			}
			// Optional: Perform any additional operations after book deletion
  
			return apiResponse.successResponseWithData(res, 'Book deleted successfully.', deletedBook);
		  });
		}
	  } catch (err) {
		// Throw error in JSON response with status 500.
		return apiResponse.ErrorResponse(res, err);
	  }
	},
  ];

  



  exports.bookSearch = [ async (req, res) => {
  const { title, author } = req.query;
  if (!title && !author) {
    return apiResponse.ErrorResponse(res, 'Title or author parameter is required.', 400);
  }

  try {
    let query = {};
    if (title) {
      query.title = { $regex: title, $options: 'i' }; // Case-insensitive search for title
    }
    if (author) {
      query.author = { $regex: author, $options: 'i' }; // Case-insensitive search for author
    }

    const books = await Book.find(query);

    return apiResponse.successResponseWithData(res, 'Search successful.', books);
  } catch (err) {
    return apiResponse.ErrorResponse(res, 'Something went wrong.', 500);
  }
}]

