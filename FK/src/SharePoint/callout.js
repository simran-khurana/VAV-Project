

SP.SOD.executeFunc("callout.js", "Callout", function () {
  var itemCtx = {};
  itemCtx.Templates = {};
  itemCtx.BaseViewID = 'Callout';
  // Define the list template type
  itemCtx.ListTemplateType = 101;
  itemCtx.Templates.Footer = function (itemCtx) {
    // context, custom action function, show the ECB menu (boolean)
    return CalloutRenderFooterTemplate(itemCtx, AddCustomAction, true);
  };
  SPClientTemplates.TemplateManager.RegisterTemplateOverrides(itemCtx);
});

 function AddCustomAction (renderCtx, calloutActionMenu) {   
  // Add your custom action
  calloutActionMenu.addAction (new CalloutAction ({
    text: "Custom Action",
    tooltip: 'This is your custom action',
    onClickCallback: function() { console.log('Callback from custom action'); }
  }));
 
  // Show the default document library actions
  CalloutOnPostRenderTemplate(renderCtx, calloutActionMenu);
 
  // Show the follow action
  calloutActionMenu.addAction(new CalloutAction({
    text: Strings.STS.L_CalloutFollowAction,
    tooltip: Strings.STS.L_CalloutFollowAction_Tooltip,
    onClickCallback: function (calloutActionClickEvent, calloutAction) {
      var callout = GetCalloutFromRenderCtx(renderCtx);
      if (!(typeof(callout) === 'undefined' || callout === null))
        callout.close();
      SP.SOD.executeFunc('followingcommon.js', 'FollowSelectedDocument', function() { FollowSelectedDocument(renderCtx); });
    }
  }));
}



////////////////////////////////



function RemoveAllItemCallouts() {
    CalloutManager.forEach(function(callout) {
        // remove the current callout
        CalloutManager.remove(callout);
    });
}
function RemoveItemCallout(sender) {
    var callout = CalloutManager.getFromLaunchPointIfExists(sender);
    if (callout != null) {
        // remove
        CalloutManager.remove(callout);
    }
} 
function CloseItemCallout(sender) {
    var callout = CalloutManager.getFromLaunchPointIfExists(sender);
    if (callout != null) {
        // close
        callout.close();
    }
}

function getCallOutFilePreviewBodyContent(urlWOPIFrameSrc, pxWidth, pxHeight) {
    var callOutContenBodySection = '<div class="js-callout-bodySection">';
    callOutContenBodySection += '<div class="js-filePreview-containingElement">';
    callOutContenBodySection += '<div class="js-frame-wrapper" style="line-height: 0">';
    callOutContenBodySection += '<iframe style="width: ' + pxWidth + 'px; height: ' + pxHeight + 'px;" src="' + urlWOPIFrameSrc + '&amp;action=interactivepreview&amp;wdSmallView=1" frameborder="0"></iframe>';
    callOutContenBodySection += '</div></div></div>';
    return callOutContenBodySection;
}
 
function OpenItemFilePreviewCallOut(sender, strTitle, urlWopiFileUrl, fileId, fileurl, listId) {
    RemoveAllItemCallouts();
    var openNewWindow = true; //set this to false to open in current window
    var urlItemUrl = fileurl;
    var callOutContenBodySection = getCallOutFilePreviewBodyContent(urlWopiFileUrl, 379, 252);
    var c = CalloutManager.getFromLaunchPointIfExists(sender);
    if (c == null) {
        c = CalloutManager.createNewIfNecessary({
            ID: 'CalloutId_' + sender.id,
            launchPoint: sender,
            beakOrientation: 'leftRight',
            title: strTitle,
            content: callOutContenBodySection,
            contentWidth: 420
        });
        var customAction = new CalloutActionOptions();
        customAction.text = 'Open';
        customAction.onClickCallback = function (event, action) {
            if (openNewWindow) {
                window.open(urlItemUrl);
                RemoveItemCallout(sender);
            } else {
                window.location.href = urlItemUrl;
            }
        };
        var _newCustomAction = new CalloutAction(customAction);
        c.addAction(_newCustomAction);

        var customAction2 = new CalloutActionOptions();
        customAction2.text = 'Properties';
        customAction2.onClickCallback = function (event, action) {
            if (openNewWindow) {
                window.open(FKSITEURL + FKLISTNAME + '/Forms/EditForm.aspx?ID=' + fileId  + '&Source=' + FKSITEURL + 'SitePages/TestCustomCallout.aspx');
                RemoveItemCallout(sender);
            } else {
                window.location.href = urlItemUrl;
            }
        };
        _newCustomAction = new CalloutAction(customAction2);
        c.addAction(_newCustomAction);

        var customAction3 = new CalloutActionOptions();
        customAction3.text = 'History';
        customAction3.onClickCallback = function (event, action) {
            if (openNewWindow) {
                window.open(FKSITEURL + '_layouts/Versions.aspx?list=' + listId + '&ID=' + fileId + '&FileName=' + fileurl + '&Source=' + FKSITEURL + 'SitePages/TestCustomCallout.aspx');
                RemoveItemCallout(sender);
            } else {
                window.location.href = urlItemUrl;
            }
        };
        _newCustomAction = new CalloutAction(customAction3);
        c.addAction(_newCustomAction);

    }
    c.open();
}




