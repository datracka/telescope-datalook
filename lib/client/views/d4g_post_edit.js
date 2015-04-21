AutoForm.hooks({
    editPostForm: {

        before: {
            editPost: function(modifier) {
                console.log(modifier)
                console.log(template)
                var post = doc;

                // ------------------------------ Checks ------------------------------ //

                if (!Meteor.user()) {
                    Messages.flash(i18n.t('you_must_be_logged_in'), "");
                    return false;
                }

                // ------------------------------ Callbacks ------------------------------ //

                // run all post edit client callbacks on modifier object successively
                post = postEditClientCallbacks.reduce(function(result, currentFunction) {
                    return currentFunction(result);
                }, post);

                return post;
            }
        },

        onSuccess: function(operation, post) {

            console.log("edit post form - success!");
            var lat = $("#latitude").val();
            var lng = $("#longitude").val();
            console.log("lat: " + lat + " lng: " + lng);
            Meteor.call("createPoiInContextBroker", post._id, lat, lng);

            trackEvent("edit post", {'postId': post._id});
            Router.go('post_page', {_id: post._id});
        },

        onError: function(operation, error) {
            console.log(error)
            Messages.flash(error.reason.split('|')[0], "error"); // workaround because error.details returns undefined
            Messages.clearSeen();
        }



    }
});

Template.d4g_post_edit.events({

});
