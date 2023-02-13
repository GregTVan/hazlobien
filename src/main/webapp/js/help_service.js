app.provider('help', function() {
    
    // TODO FRENCH
    var help_pages = [{
        title: 'Menu Functions',
        entries: [{
            title: 'Search',
            file_name: 'search'
        },{
            title: 'Activity',
            file_name: 'activity'
        },{
            title: 'Administration',
            file_name: 'administration'
        },{
            title: 'Reference',
            file_name: 'reference'
        }]
    },{
        title: 'General Information',
        entries: [{
            title: 'Adverse Media',
            file_name: 'adverse_media'
        },{
            title: 'Batch Searches',
            file_name: 'batch_search'
        },{
            title: 'Configure Canchek-eID',
            file_name: 'configure_eid'
        },{
            title: 'False Positive Tracking',
            file_name: 'false_positive_tracking'
        },{
            title: 'Managing Users',
            file_name: 'manage_users'
        },{
            title: 'FAQ',
            file_name: 'faq'
        }]
    }];

    this.$get = function() {
        return function() {
            return help_pages;
        }
    }

});