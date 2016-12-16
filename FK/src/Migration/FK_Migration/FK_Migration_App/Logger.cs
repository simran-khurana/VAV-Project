using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FK_Migration
{

    public sealed class Logger
    {
        private static readonly Lazy<Logger> lazy =
            new Lazy<Logger>(() => new Logger());
    
        public static Logger GetInstance { get { return lazy.Value; } }
 
        private Logger()
        {
        }

        public enum LogType
        {
            Normal
            , Warning
            , Error
        }

        public System.Windows.Forms.RichTextBox TextBox { private get; set; }

        public void AddRow(string text, LogType logType)
        {
            Color color;
            switch(logType)
            {
                case LogType.Normal:
                    color = Color.Black;
                    break;
                case LogType.Warning:
                    color = Color.Orange;
                    break;
                case LogType.Error: 
                    color = Color.Red;
                    break;
                default:
                    throw new InvalidOperationException("unknown color");
            }
            TextBox.AppendRow(text, color);
            TextBox.ScrollToCaret();
            TextBox.Update();
        }
    }
}
