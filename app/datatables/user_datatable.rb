class UserDatatable < AjaxDatatablesRails::Base
  # uncomment the appropriate paginator module,
  # depending on gems available in your project.
  # include AjaxDatatablesRails::Extensions::Kaminari
  include AjaxDatatablesRails::Extensions::WillPaginate
  # include AjaxDatatablesRails::Extensions::SimplePaginator

  def sortable_columns
    # list columns inside the Array in string dot notation.
    # Example: 'users.email'
    @sortable_columns ||= %w(User.first_name User.last_name User.email)
  end

  def searchable_columns
    # list columns inside the Array in string dot notation.
    # Example: 'users.email'
    @searchable_columns ||= %w(users.last_name users.mi)
  end

  private

  def data
    records.map do |record|
      [
        record.first_name,
        record.last_name,
        record.email
        # comma separated list of the values for each cell of a table row
        # example: record.attribute,
      ]
    end
  end

  def get_raw_records
    User.all
    # insert query here
  end

  def fetch_records
    records = get_raw_records
    records = sort_records(records) if params[:order].present?
    records = filter_records(records) if params[:search].present?
    records = paginate_records(records) unless params[:length].present? && params[:length] == '-1'
    records
  end

  def filter_records(records)
    records = simple_search(records)
    records
  end

  def simple_search(records)
    return records unless (params[:search].present? && params[:search][:value].present?)
    conditions = build_conditions_for(params[:search][:value])
    records = records.where(conditions) if conditions
    records
  end


  # ==== Insert 'presenter'-like methods below if necessary

end
