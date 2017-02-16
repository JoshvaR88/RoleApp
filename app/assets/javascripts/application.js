// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require twitter/bootstrap
//= require jquery_nested_form
//= require dataTables/jquery.dataTables
//= require turbolinks
//= require_tree .

$( document ).on('turbolinks:load', function() {
  
    $.ajax({
    url: '/users',
    type: 'GET',
    dataType: 'json',
    cache: false,
    "data": data,
    success: function(response) {
      var table = $('.users_datatable').DataTable( {
        "stripeClasses": [ 'odd-row', 'even-row' ],
        "lengthMenu": [[50, 100, 200], [50, 100, 200]],
        // stateSave: true,
        // "pageLength": 200,
        // "bLengthChange": false,
        "searching": false,
        "scrollResize": true,
        "scrollY": "26.8vh",
        "bScrollCollapse": true,
        "sPaginationType": "input",
        "processing": true,
        "serverSide": true,
        "fnCreatedRow": function( nRow, aData, iDataIndex ) {
          $(nRow).children("td").css("overflow", "hidden");
          $(nRow).children("td").css("white-space", "nowrap");
          $(nRow).children("td").css("text-overflow", "ellipsis");
          $(nRow).children("td").css("padding", "4px 6px");
        },
        "keys": {
          keys: [ 38 /* up */, 40 /* down */, 13 /* enter */],
        },
        "ajax": {
          "type" : "POST",
          "url" : "/users/datatable_data",
          "data": function ( d ) {
            d.order[0].sort_column = Crm.resourceData[resourceName].grid_columns[d.order[0].column].data
          },
        },

        "drawCallback": function( settings ) {
          resourceName = resourceManagement.getResourceDataKey(originalResourceName).replace(/[-][0-9]+/g, "")
          dataTableContainer = $('#data_table_' + originalResourceName)
          resourceManagement.resources.getResourceByName(originalResourceName).resourceGrid = table
          dataTableGrid.setupOnStoreSearchGrid(options, table, originalResourceName);
          resourceManagement.contextMenuShow(options, table, dataTableContainer, resourceName);
          resourceManagement.rowEvents(table, dataTableContainer, resourceName, originalResourceName);
          resourceManagement.searchDataEvents(table, dataTableContainer, resourceName, originalResourceName);
          if(resourceManagement.isSplitView(resourceName)) {
            $("#split_pane_loading_animation_" + originalResourceName).hide();
          } else {
            $("#loading_animation_" + originalResourceName).hide();
          }
          disableOpenForm = resourceManagement.resources.getResourceByName(originalResourceName).params.disable_open_form
          if ((typeof(selectedID) == "undefined") && (disableOpenForm == "false")) {
            table.cell( ':eq(0)' ).focus();
            $('#' + resourceName + '_search').focus();
          } else {
            dataTableGrid.afterReloadSelect(dataTableContainer, resourceName, selectedID, table)
          }

        }
      });

      $("<div class='refresh-data'/>").insertAfter(dataTableContainer.find('.dataTables_info'));
 
      dataTableContainer.find('.dt-footer-right').append(dataTableContainer.find('#' + resourceName  + '_datatable_length'));
      visibleColumns = parseInt(dataTableContainer.find('.' + resourceName + '-datatable-column').attr("data-columns"))
      if (visibleColumns > 1) {
        var colvis = new $.fn.dataTable.ColVis( table, {
            buttonText: "Select Columns",
            aiExclude: [0,visibleColumns]
        } );

        dataTableContainer.find('.dt-footer-right').append($( colvis.button()));
      } else {
        dataTableContainer.find('.dt-footer-right').find('#' + resourceName + '_datatable_paginate').css('cssText', "width:45% !important");
      }
      dataTableGrid.headerEvent(originalResourceName, true);
      dataTableGrid.pageDataLengthEvent(table)
      dataTableGrid.paginationEvent(table)
      dataTableGrid.reloadListener(originalResourceName)
      table.on( 'key-focus', function ( e, datatable, cell ) {
        if (typeof(cell.index()) != "undefined") {
          resourceName = resourceManagement.getResourceDataKey(Crm.activeResourceName).replace(/[-][0-9]+/g, "")
          var row = datatable.row(cell.index().row);
          var selectedRows = $('#data_table_' + Crm.activeResourceName).find( '#' + resourceName + '_datatable tbody tr.selected')
          if (!(cntrlIsPressed) && !(shiftIsPressed)) {
            selectedRows.removeClass("selected");
            $( row.node() ).addClass( "selected" );
          } else {
            if ($( row.node() ).hasClass( "selected" )) {
              if (selectedRows.length > 1) {
                $( row.node() ).toggleClass( "selected" );
              }
            } else {
              $( row.node() ).addClass( "selected" );
            }
          }
          if (resourceManagement.isSplitView(Crm.activeResourceName)) {
            var data = datatable.data().row(row).data()
            var recordId = data.id
            resourceManagement.getDatatableAndShowDetailForm(recordId, Crm.activeResourceName);
          }
          dataTableGrid.calculateGridAmount(resourceManagement.resources.getResourceByName(Crm.activeResourceName).resourceGrid, resourceName);
          // $( cell.node() ).removeClass( "focus" );
        }
      } );
    }
  });
})